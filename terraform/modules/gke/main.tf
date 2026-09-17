variable "project_id" { type = string }
variable "zone" { type = string }
variable "network" { type = string }
variable "subnetwork" { type = string }
variable "deletion_protection" { type = bool }
resource "google_service_account" "node" {
  account_id   = "sport-gke-node"
  display_name = "GKE node identity"
}
resource "google_project_iam_member" "node" {
  for_each = toset(["roles/logging.logWriter", "roles/monitoring.metricWriter", "roles/monitoring.viewer", "roles/artifactregistry.reader"])
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.node.email}"
}
resource "google_container_cluster" "main" {
  name                     = "sport-platform"
  location                 = var.zone
  network                  = var.network
  subnetwork               = var.subnetwork
  deletion_protection      = var.deletion_protection
  remove_default_node_pool = true
  initial_node_count       = 1
  networking_mode          = "VPC_NATIVE"
  release_channel { channel = "REGULAR" }
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }
  workload_identity_config { workload_pool = "${var.project_id}.svc.id.goog" }
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }
  node_config {
    service_account = google_service_account.node.email
    oauth_scopes    = ["https://www.googleapis.com/auth/cloud-platform"]
  }
  depends_on = [google_project_iam_member.node]
}
resource "google_container_node_pool" "main" {
  name       = "sport-pool"
  location   = var.zone
  cluster    = google_container_cluster.main.name
  node_count = 1
  node_config {
    machine_type    = "e2-standard-2"
    disk_size_gb    = 30
    service_account = google_service_account.node.email
    oauth_scopes    = ["https://www.googleapis.com/auth/cloud-platform"]
    workload_metadata_config { mode = "GKE_METADATA" }
  }
  management {
    auto_repair  = true
    auto_upgrade = true
  }
}
output "cluster_name" { value = google_container_cluster.main.name }
