# Mirrors the repo's current settings so the post-import plan shows no changes.
resource "github_repository" "site" {
  name         = "wumbotechsite-svelte"
  description  = ""
  homepage_url = "https://wumbotechsite-svelte.vercel.app"
  visibility   = "public"

  has_issues   = true
  has_projects = true
  has_wiki     = true

  allow_merge_commit  = true
  allow_squash_merge  = true
  allow_rebase_merge  = true
  allow_auto_merge    = false
  allow_update_branch = false

  delete_branch_on_merge = false

  merge_commit_title          = "MERGE_MESSAGE"
  merge_commit_message        = "PR_TITLE"
  squash_merge_commit_title   = "COMMIT_OR_PR_TITLE"
  squash_merge_commit_message = "COMMIT_MESSAGES"

  topics      = []
  is_template = false
  archived    = false
}

# NEW resource — no branch protection exists today. Configured conservatively for
# a solo maintainer: require the existing CI check to pass, but do not require PR
# reviews and do not enforce on admins, so you can never fence yourself out of main.
# Effect: because `verify` only runs on pull_request, merges to main go through PRs.
resource "github_branch_protection" "main" {
  repository_id = github_repository.site.node_id
  pattern       = "main"

  required_status_checks {
    strict = true
    # Job names in .github/workflows/ci.yml. tfstate-guard requires committed
    # state whenever terraform/*.tf changes.
    contexts = ["verify", "tfstate-guard"]
  }

  enforce_admins          = false
  required_linear_history = false
  allows_force_pushes     = false
  allows_deletions        = false
}

# Escape hatch for the tfstate-guard CI check: apply this label to a PR that
# changes terraform/*.tf but intentionally produces no state diff.
resource "github_issue_label" "no_state_change" {
  repository  = github_repository.site.name
  name        = "no-state-change"
  color       = "ededed"
  description = "PR changes terraform/*.tf but intentionally no state; skips tfstate-guard"
}

# Forward-looking: identifiers a future CI deploy/plan workflow would consume.
# Non-secret, so stored as Actions variables.
resource "github_actions_variable" "vercel_org_id" {
  repository    = github_repository.site.name
  variable_name = "VERCEL_ORG_ID"
  value         = var.vercel_team_id
}

resource "github_actions_variable" "vercel_project_id" {
  repository    = github_repository.site.name
  variable_name = "VERCEL_PROJECT_ID"
  value         = vercel_project.site.id
}

# Created only when TF_VAR_ci_vercel_token is provided.
resource "github_actions_secret" "vercel_token" {
  count           = var.ci_vercel_token != "" ? 1 : 0
  repository      = github_repository.site.name
  secret_name     = "VERCEL_TOKEN"
  plaintext_value = var.ci_vercel_token
}
