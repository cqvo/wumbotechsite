# Infrastructure (OpenTofu)

Manages the Vercel project and the `cqvo/wumbotechsite-svelte` GitHub repo as code.

- **Tool:** [OpenTofu](https://opentofu.org) (`tofu`) — `brew install opentofu`.
- **State:** local, encrypted at rest (see `encryption.tf`). State files are gitignored.
- **Providers:** `vercel/vercel`, `integrations/github`.

## What's managed

| Resource | Action | Notes |
|---|---|---|
| `vercel_project.site` | imported | framework, Node 22.x, git link |
| `vercel_project_environment_variable.public_gtm_id` | import or create | `PUBLIC_GTM_ID` (see below) |
| `vercel_project_domain.{apex,www}` | imported | `wumbo.tech`, `www.wumbo.tech` |
| `github_repository.site` | imported | mirrors current settings |
| `github_branch_protection.main` | **created** | requires the `verify` CI check |
| `github_actions_variable.*` | created | `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| `github_actions_secret.vercel_token` | created (optional) | only if `TF_VAR_ci_vercel_token` set |

## Setup

1. **Install OpenTofu:** `brew install opentofu`
2. **Create credentials:**
   - Vercel API token → https://vercel.com/account/tokens
   - GitHub PAT with `repo` scope → https://github.com/settings/tokens
3. **Export environment variables:**
   ```sh
   export TF_VAR_state_passphrase='choose-a-strong-passphrase'   # store this durably!
   export TF_VAR_vercel_api_token='...'
   export TF_VAR_github_token='...'
   export TF_VAR_gtm_id='GTM-XXXXXXX'
   # optional, to create the CI VERCEL_TOKEN secret:
   # export TF_VAR_ci_vercel_token='...'
   ```

## Runbook

```sh
cd terraform
tofu init
tofu fmt -check
tofu validate
tofu plan      # KEY CHECK: imports resolve with NO destructive changes
tofu apply
```

The **`tofu plan`** step is the safety gate: it should show the existing project/repo
being *imported* and reconciled to zero changes. The only *new* resources should be
branch protection and the Actions variables/secret. If you see unexpected
modify/replace/destroy on the imported resources, **stop and tune the config** —
do not apply.

### Fetch the env var ID (only if `PUBLIC_GTM_ID` already exists in Vercel)

```sh
curl -s -H "Authorization: Bearer $TF_VAR_vercel_api_token" \
  "https://api.vercel.com/v9/projects/prj_ESMIJL9KI4jH8v2As0AC8vgDTdTI/env?teamId=team_hbvzY3Fd6qNjEiPHutKWYO2A" \
  | python3 -c 'import sys,json; [print(e["key"], e["id"]) for e in json.load(sys.stdin)["envs"]]'
```

Put the `PUBLIC_GTM_ID` id into the commented `import` block in `imports.tf` and uncomment it.
If `PUBLIC_GTM_ID` is **not** listed, leave that block commented — OpenTofu will create
the variable from `TF_VAR_gtm_id`.

## Notes

- **Branch protection** requires the `verify` status check. Because `verify` only runs on
  `pull_request`, this effectively makes `main` PR-only. `enforce_admins` is off so the
  owner is never locked out.
- Losing `TF_VAR_state_passphrase` makes the encrypted state **unrecoverable**. Back it up.
- `.terraform.lock.hcl` is committed; `.tfstate`, `.tfvars`, and `.terraform/` are gitignored.
