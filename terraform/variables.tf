# Secrets are supplied at runtime via TF_VAR_* environment variables (never committed).
# Non-secret identifiers default to this project's real values.

variable "state_passphrase" {
  description = "Passphrase used to encrypt OpenTofu state at rest. Provide via TF_VAR_state_passphrase."
  type        = string
  sensitive   = true
}

variable "vercel_api_token" {
  description = "Vercel API token (vercel.com/account/tokens). Provide via TF_VAR_vercel_api_token."
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel team ID that owns the project."
  type        = string
  default     = "team_hbvzY3Fd6qNjEiPHutKWYO2A" # WumboTech
}

variable "github_token" {
  description = "GitHub PAT with 'repo' scope. Provide via TF_VAR_github_token."
  type        = string
  sensitive   = true
}

variable "github_owner" {
  description = "GitHub account that owns the repo."
  type        = string
  default     = "cqvo"
}

variable "gtm_id" {
  description = "Google Tag Manager container ID exposed to the client as PUBLIC_GTM_ID (e.g. GTM-XXXXXXX)."
  type        = string
}

variable "ci_vercel_token" {
  description = "Vercel token stored as a GitHub Actions secret for future CI deploy/plan jobs. Provide via TF_VAR_ci_vercel_token; leave empty to skip."
  type        = string
  sensitive   = true
  default     = ""
}
