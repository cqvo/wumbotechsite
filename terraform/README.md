# Infrastructure (OpenTofu)

Manages the Vercel project and the `cqvo/wumbotechsite-svelte` GitHub repo as code.

- **Tool:** [OpenTofu](https://opentofu.org) (`tofu`) — `brew install opentofu`.
- **State:** **committed to this repo, encrypted at rest** (OpenTofu native AES-256-GCM, see `encryption.tf`). The passphrase lives in **1Password**, never in the repo.
- **Workflow:** applied **locally** by a single maintainer. No CI/remote runner.
- **Providers:** `vercel/vercel`, `integrations/github`.

## Why state is committed

This is a solo, infrequently-touched project. Committing the (encrypted) state keeps
everything self-contained — no external state service to lapse or relearn — and gives a
free off-machine backup. It is safe **only because the state is encrypted**: never disable
`encryption.tf`, and use a long, high-entropy passphrase (the ciphertext is public).

Trade-offs: no locking (fine for one maintainer), and you must **commit the state after
each apply**. If you forget, the next `tofu plan` just shows the drift.

## What's managed

| Resource | Action | Notes |
|---|---|---|
| `vercel_project.site` | imported | framework, Node 22.x, git link |
| `vercel_project_environment_variable.public_gtm_id` | import or create | `PUBLIC_GTM_ID` (see below) |
| `vercel_project_domain.{apex,www}` | imported | `wumbo.tech`, `www.wumbo.tech` |
| `github_repository.site` | imported | mirrors current settings |
| `github_branch_protection.main` | **created** | requires the `verify` CI check |
| `github_actions_variable.*` | created | `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| `github_actions_secret.vercel_token` | created (optional) | only if `ci_vercel_token` set |

## Setup

1. **Install OpenTofu:** `brew install opentofu`
2. **Create credentials:**
   - Vercel API token → https://vercel.com/account/tokens
   - GitHub PAT with `repo` scope → https://github.com/settings/tokens
   - A strong state passphrase (≥ 16 chars) → store in **1Password**
3. **Provide variables** — either copy `terraform.auto.tfvars.example` to
   `terraform.auto.tfvars` (gitignored) and fill it in, **or** export `TF_VAR_*`,
   pulling secrets from 1Password:
   ```sh
   export TF_VAR_state_passphrase=$(op read "op://Private/wumbo-tofu-state/passphrase")
   export TF_VAR_vercel_api_token=$(op read "op://Private/wumbo-vercel-token/credential")
   export TF_VAR_github_token=$(op read "op://Private/wumbo-github-pat/credential")
   export TF_VAR_gtm_id='GTM-XXXXXXX'
   ```
   `TF_VAR_state_passphrase` is required for **every** `tofu` invocation.

## First run (import) + ongoing

```sh
cd terraform
tofu init
tofu plan      # KEY CHECK: imports resolve with NO destructive changes
tofu apply     # adopts the existing project/repo/domains into encrypted state
git add terraform/terraform.tfstate && git commit -m "tofu: import infra into state"
```

The `tofu plan` step is the safety gate: it should show the existing project/repo being
*imported* and reconciled to zero changes. The only *new* resources are branch protection
and the Actions variables/secret. **If you see unexpected modify/replace/destroy on the
imported resources, stop and tune the config — do not apply.**

After the first successful apply, open a follow-up commit removing the `import {}` blocks
in `imports.tf`. For every later change: edit config → `tofu apply` → **commit the updated
`terraform/terraform.tfstate`**.

### Fetch the env var ID (only if `PUBLIC_GTM_ID` already exists in Vercel)

```sh
curl -s -H "Authorization: Bearer $TF_VAR_vercel_api_token" \
  "https://api.vercel.com/v9/projects/prj_ESMIJL9KI4jH8v2As0AC8vgDTdTI/env?teamId=team_hbvzY3Fd6qNjEiPHutKWYO2A" \
  | python3 -c 'import sys,json; [print(e["key"], e["id"]) for e in json.load(sys.stdin)["envs"]]'
```

Put the `PUBLIC_GTM_ID` id into the commented `import` block in `imports.tf` and uncomment it.
If `PUBLIC_GTM_ID` is **not** listed, leave it commented — OpenTofu creates it from `gtm_id`.

## Notes

- **Branch protection** requires the `verify` status check. Because `verify` only runs on
  `pull_request`, this effectively makes `main` PR-only. `enforce_admins` is off so the
  owner is never locked out.
- **Losing the passphrase = unrecoverable state.** 1Password is the durable copy.
- Committed: `*.tf`, `.terraform.lock.hcl`, and the encrypted `terraform.tfstate`.
  Gitignored: `*.tfstate.backup`, `terraform.auto.tfvars`, `.terraform/`, `*.tfplan`.
