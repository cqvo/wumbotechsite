resource "vercel_project" "site" {
  name      = "wumbotechsite"
  framework = "svelte"

  # Matches svelte.config.js (adapter pinned to nodejs22.x).
  node_version = "22.x"

  git_repository = {
    type              = "github"
    repo              = "cqvo/wumbotechsite"
    production_branch = "main"
  }
}

# PUBLIC_GTM_ID is read in src/lib/analytics/gtm.svelte via $env/dynamic/public.
# NOTE: PUBLIC_VERCEL_TARGET_ENV (used in src/hooks.server.ts) is a Vercel SYSTEM
# variable — it is auto-populated by Vercel and intentionally NOT managed here.
resource "vercel_project_environment_variable" "public_gtm_id" {
  project_id = vercel_project.site.id
  key        = "PUBLIC_GTM_ID"
  value      = var.gtm_id
  # Matches the existing Vercel var (production only). Add "preview"/"development"
  # here if you later want analytics in those environments.
  target = ["production"]
}

# Custom domains attached to the project. The *.vercel.app domains are
# auto-assigned by Vercel and are not managed here.
# If one domain redirects to the other in the dashboard, the post-import plan
# will surface it — add `redirect`/`redirect_status_code` here to match.
resource "vercel_project_domain" "apex" {
  project_id = vercel_project.site.id
  domain     = "wumbo.tech"
  redirect   = "www.wumbo.tech" # apex redirects to www (matches live config)
}

resource "vercel_project_domain" "www" {
  project_id = vercel_project.site.id
  domain     = "www.wumbo.tech"
}
