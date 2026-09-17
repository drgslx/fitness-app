resource "google_project_service" "apis" {
  for_each = toset([
    "compute.googleapis.com", "container.googleapis.com", "artifactregistry.googleapis.com",
    "storage.googleapis.com", "secretmanager.googleapis.com", "iam.googleapis.com",
    "iamcredentials.googleapis.com", "sts.googleapis.com", "identitytoolkit.googleapis.com"
  ])
  service            = each.value
  disable_on_destroy = false
}
data "google_project" "current" {}

resource "google_compute_network" "main" {
  name                    = "sport-network"
  auto_create_subnetworks = false
  depends_on              = [google_project_service.apis]
}
resource "google_compute_subnetwork" "main" {
  name                     = "sport-subnet"
  region                   = var.region
  network                  = google_compute_network.main.id
  ip_cidr_range            = "10.20.0.0/20"
  private_ip_google_access = true
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.24.0.0/14"
  }
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.28.0.0/20"
  }
}
resource "google_compute_router" "main" {
  name    = "sport-router"
  region  = var.region
  network = google_compute_network.main.id
}
resource "google_compute_router_nat" "main" {
  name                               = "sport-nat"
  region                             = var.region
  router                             = google_compute_router.main.name
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}
resource "google_artifact_registry_repository" "containers" {
  location      = var.region
  repository_id = "sport-platform"
  format        = "DOCKER"
  depends_on    = [google_project_service.apis]
}
module "gke" {
  source              = "./modules/gke"
  project_id          = var.project_id
  zone                = var.zone
  network             = google_compute_network.main.id
  subnetwork          = google_compute_subnetwork.main.id
  deletion_protection = var.deletion_protection
  depends_on          = [google_project_service.apis, google_compute_router_nat.main]
}
module "database_vm" {
  source              = "./modules/database-vm"
  project_id          = var.project_id
  region              = var.region
  zone                = var.zone
  network             = google_compute_network.main.id
  subnetwork          = google_compute_subnetwork.main.id
  deletion_protection = var.deletion_protection
  depends_on          = [google_project_service.apis, google_compute_router_nat.main]
}
module "storage" {
  source     = "./modules/storage"
  project_id = var.project_id
  region     = var.region
  depends_on = [google_project_service.apis]
}
resource "google_compute_global_address" "web" {
  name       = "sport-web-ip"
  depends_on = [google_project_service.apis]
}

resource "google_service_account" "api" {
  account_id   = "sport-api"
  display_name = "Sport API workload"
  depends_on   = [google_project_service.apis]
}
resource "google_service_account_iam_member" "api_workload" {
  service_account_id = google_service_account.api.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[sport-platform/sport-api]"
  depends_on         = [module.gke]
}
resource "google_project_iam_member" "firebase_reader" {
  project = var.project_id
  role    = "roles/firebaseauth.viewer"
  member  = "serviceAccount:${google_service_account.api.email}"
}
resource "google_storage_bucket_iam_member" "api_images" {
  bucket = module.storage.bucket_name
  role   = "roles/storage.objectUser"
  member = "serviceAccount:${google_service_account.api.email}"
}

resource "google_iam_workload_identity_pool" "github" {
  count                     = var.github_repository == "" ? 0 : 1
  workload_identity_pool_id = "sport-github"
  depends_on                = [google_project_service.apis]
}
resource "google_iam_workload_identity_pool_provider" "github" {
  count                              = var.github_repository == "" ? 0 : 1
  workload_identity_pool_id          = google_iam_workload_identity_pool.github[0].workload_identity_pool_id
  workload_identity_pool_provider_id = "github"
  attribute_mapping = {
    "google.subject"          = "assertion.sub"
    "attribute.repository"    = "assertion.repository"
    "attribute.repository_id" = "assertion.repository_id"
  }
  attribute_condition = "assertion.repository_id == '${var.github_repository_id}' && assertion.repository == '${var.github_repository}' && assertion.ref == 'refs/heads/main'"
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}
resource "google_service_account" "deployer" {
  count        = var.github_repository == "" ? 0 : 1
  account_id   = "sport-deployer"
  display_name = "GitHub sport deployment"
  depends_on   = [google_project_service.apis]
}
resource "google_service_account_iam_member" "github_deployer" {
  count              = var.github_repository == "" ? 0 : 1
  service_account_id = google_service_account.deployer[0].name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github[0].name}/attribute.repository_id/${var.github_repository_id}"
}
resource "google_project_iam_member" "deployer_cluster" {
  count   = var.github_repository == "" ? 0 : 1
  project = var.project_id
  role    = "roles/container.developer"
  member  = "serviceAccount:${google_service_account.deployer[0].email}"
}
resource "google_artifact_registry_repository_iam_member" "deployer_images" {
  count      = var.github_repository == "" ? 0 : 1
  project    = var.project_id
  location   = var.region
  repository = google_artifact_registry_repository.containers.repository_id
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.deployer[0].email}"
}
resource "google_secret_manager_secret_iam_member" "deployer_db" {
  count     = var.github_repository == "" ? 0 : 1
  secret_id = module.database_vm.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.deployer[0].email}"
}
