terraform {
  # State encryption (encryption.tf) requires OpenTofu >= 1.7.
  required_version = ">= 1.7.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 3.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}
