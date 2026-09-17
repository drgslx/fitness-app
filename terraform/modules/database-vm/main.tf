variable "project_id" { type = string }
variable "region" { type = string }
variable "zone" { type = string }
variable "network" { type = string }
variable "subnetwork" { type = string }
variable "deletion_protection" { type = bool }
resource "random_password" "db" {
  length  = 40
  special = false
}
resource "google_secret_manager_secret" "password" {
  secret_id = "sport-postgres-password"
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret_version" "password" {
  secret      = google_secret_manager_secret.password.id
  secret_data = random_password.db.result
}
resource "google_service_account" "db" {
  account_id = "sport-postgres"
}
resource "google_secret_manager_secret_iam_member" "db" {
  secret_id = google_secret_manager_secret.password.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.db.email}"
}
resource "google_compute_disk" "data" {
  name = "sport-postgres-data"
  zone = var.zone
  type = "pd-balanced"
  size = 20
  lifecycle { prevent_destroy = true }
}
resource "google_compute_resource_policy" "backup" {
  name   = "sport-db-daily"
  region = var.region
  snapshot_schedule_policy {
    schedule {
      daily_schedule {
        days_in_cycle = 1
        start_time    = "02:00"
      }
    }
    retention_policy {
      max_retention_days    = 7
      on_source_disk_delete = "KEEP_AUTO_SNAPSHOTS"
    }
  }
}
resource "google_compute_disk_resource_policy_attachment" "backup" {
  name = google_compute_resource_policy.backup.name
  disk = google_compute_disk.data.name
  zone = var.zone
}
resource "google_compute_instance" "postgres" {
  name                = "sport-postgres"
  machine_type        = "e2-small"
  zone                = var.zone
  deletion_protection = var.deletion_protection
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 15
      type  = "pd-balanced"
    }
  }
  attached_disk {
    source      = google_compute_disk.data.id
    device_name = "sport-postgres-data"
  }
  network_interface {
    subnetwork = var.subnetwork
  }
  service_account {
    email  = google_service_account.db.email
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }
  metadata = { enable-oslogin = "TRUE" }
  metadata_startup_script = templatefile("${path.module}/startup.sh.tftpl", {
    project_id = var.project_id
    secret_id  = google_secret_manager_secret.password.secret_id
  })
  tags       = ["sport-postgres"]
  depends_on = [google_secret_manager_secret_version.password, google_secret_manager_secret_iam_member.db]
}
resource "google_compute_firewall" "postgres" {
  name          = "sport-postgres-internal"
  network       = var.network
  source_ranges = ["10.20.0.0/20", "10.24.0.0/14"]
  target_tags   = ["sport-postgres"]
  allow {
    protocol = "tcp"
    ports    = ["5432"]
  }
}
resource "google_compute_firewall" "iap" {
  name          = "sport-db-iap-ssh"
  network       = var.network
  source_ranges = ["35.235.240.0/20"]
  target_tags   = ["sport-postgres"]
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
}
output "private_ip" { value = google_compute_instance.postgres.network_interface[0].network_ip }
output "secret_id" { value = google_secret_manager_secret.password.secret_id }
