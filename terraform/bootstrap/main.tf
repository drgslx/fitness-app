terraform {
  required_version = ">= 1.10"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}
variable "project_id" { type = string }
provider "google" { project = var.project_id }
resource "google_storage_bucket" "state" {
  name                        = "${var.project_id}-sport-tfstate"
  location                    = "EU"
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  versioning { enabled = true }
  lifecycle { prevent_destroy = true }
}
output "state_bucket" { value = google_storage_bucket.state.name }
