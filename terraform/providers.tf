provider "vercel" {
  api_token = var.vercel_api_token
  # The project lives under the WumboTech team, so scope the provider to it.
  team = var.vercel_team_id
}

provider "github" {
  owner = var.github_owner
  token = var.github_token
}
