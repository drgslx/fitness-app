variable "project_id" { type = string }
variable "region" { type = string }
resource "google_storage_bucket" "images" {
  name                        = "${var.project_id}-sport-images"
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = false
  versioning { enabled = true }
}
output "bucket_name" { value = google_storage_bucket.images.name }
