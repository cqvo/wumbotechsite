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

# Mirrors the existing "Protect main" repository ruleset (imported). Admins can
# always bypass, so the owner is never fenced out of main. Requires the `verify`
# status check (the job in .github/workflows/ci.yml) before merging to main.
resource "github_repository_ruleset" "main" {
  name        = "Protect main"
  repository  = github_repository.site.name
  target      = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = ["~DEFAULT_BRANCH"]
      exclude = []
    }
  }

  bypass_actors {
    actor_id    = 5 # Admin repository role
    actor_type  = "RepositoryRole"
    bypass_mode = "always"
  }

  rules {
    deletion         = true
    non_fast_forward = true

    pull_request {
      required_approving_review_count   = 0
      dismiss_stale_reviews_on_push     = true
      require_code_owner_review         = false
      require_last_push_approval        = false
      required_review_thread_resolution = true
      allowed_merge_methods             = ["merge", "squash", "rebase"]
    }

    required_status_checks {
      strict_required_status_checks_policy = true
      do_not_enforce_on_create             = false

      required_check {
        context = "verify"
      }
    }
  }
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
