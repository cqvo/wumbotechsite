# Remote state in Cloudflare R2 (S3-compatible). State is NOT committed to the
# repo. OpenTofu client-side encryption (encryption.tf) keeps the object in R2
# ciphertext-only, so `encrypt` (server-side SSE) is irrelevant here.
#
# Backend blocks cannot use variables, so the bucket + endpoint are literals
# (non-secret). Fill <R2_ACCOUNT_ID> after creating the bucket. R2 S3 credentials
# come from the environment: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (from an
# R2 API token) — see README.
terraform {
  backend "s3" {
    bucket = "wumbo-tofu-state"
    key    = "wumbotechsite/terraform.tfstate"
    region = "auto"

    endpoints = { s3 = "https://2dac5afbbf9ef38caffd8307c398e706.r2.cloudflarestorage.com" }

    use_lockfile   = true # native locking via S3 conditional writes (OpenTofu 1.12+)
    use_path_style = true
    encrypt        = false

    skip_credentials_validation = true
    skip_region_validation      = true
    skip_metadata_api_check     = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
  }
}
