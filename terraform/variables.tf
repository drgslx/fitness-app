variable "project_id" {
  type = string
}
variable "region" {
  type    = string
  default = "europe-west1"
}
variable "zone" {
  type    = string
  default = "europe-west1-b"
}
variable "deletion_protection" {
  type    = bool
  default = true
}
variable "github_repository" {
  description = "Exact OWNER/REPO, or empty to skip GitHub identity creation."
  type        = string
  default     = ""
}
variable "github_repository_id" {
  description = "Numeric immutable GitHub repository ID."
  type        = string
  default     = ""
  validation {
    condition     = var.github_repository == "" || can(regex("^[0-9]+$", var.github_repository_id))
    error_message = "Set the numeric GitHub repository ID when enabling GitHub federation."
  }
}
