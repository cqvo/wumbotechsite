# Infrastructure (OpenTofu)

Manages the Vercel project and the `cqvo/wumbotechsite-svelte` GitHub repo as code.

- **Tool:** [OpenTofu](https://opentofu.org) (`tofu`) — `brew install opentofu`.
- **State:** **Cloudflare R2** (S3-compatible) via the `s3` backend, encrypted **client-side** by OpenTofu (AES-256-GCM, see `encryption.tf`) so R2 only ever stores ciphertext. State is **never** committed to the repo.
- **Workflow:** applied **locally** by a single maintainer. No CI/remote runner.
- **Providers:** `vercel/vercel`, `integrations/github`.

## What's managed

| Resource                                            | Action             | Notes                                |
| --------------------------------------------------- | ------------------ | ------------------------------------ |
| `vercel_project.site`                               | imported           | framework, Node 22.x, git link       |
| `vercel_project_environment_variable.public_gtm_id` | import or create   | `PUBLIC_GTM_ID` (see below)          |
| `vercel_project_domain.{apex,www}`                  | imported           | `wumbo.tech`, `www.wumbo.tech`       |
| `github_repository.site`                            | imported           | mirrors current settings             |
| `github_repository_ruleset.main`                    | imported           | "Protect main"; requires `verify`    |
| `github_actions_variable.*`                         | created            | `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| `github_actions_secret.vercel_token`                | created (optional) | only if `ci_vercel_token` set        |

## Setup

1. **Install OpenTofu:** `brew install opentofu`
2. **Create the R2 state bucket:**
   - In Cloudflare, create an **R2 bucket** (e.g. `wumbo-tofu-state`) and note your **account ID**.
   - Create an **R2 API token** (Object Read & Write) → an S3 **Access Key ID** + **Secret**.
   - Put your account ID into the endpoint in `backend.tf` (and the bucket name if different).
3. **Create the provider credentials:**
   - Vercel API token → https://vercel.com/account/tokens
   - GitHub token → a **fine-grained** PAT scoped to only `cqvo/wumbotechsite-svelte`
     (see [GitHub token permissions](#github-token-permissions)); a classic `repo`-scope PAT also works.
   - A strong state passphrase (≥ 16 chars) → store in **1Password**.
4. **Export credentials** (R2 keys are env vars, not tfvars). Pull secrets from 1Password:
   ```sh
   # R2 state backend (S3 credentials from the R2 API token)
   export AWS_ACCESS_KEY_ID=$(op read "op://Private/wumbo-r2-token/access-key-id")
   export AWS_SECRET_ACCESS_KEY=$(op read "op://Private/wumbo-r2-token/secret-access-key")
   # OpenTofu state encryption + providers
   export TF_VAR_state_passphrase=$(op read "op://Private/wumbo-tofu-state/passphrase")
   export TF_VAR_vercel_api_token=$(op read "op://Private/wumbo-vercel-token/credential")
   export TF_VAR_github_token=$(op read "op://Private/wumbo-github-pat/credential")
   export TF_VAR_gtm_id='GTM-XXXXXXX'
   ```
   `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `TF_VAR_state_passphrase` are required
   for **every** `tofu` invocation. Non-secret `gtm_id` can instead live in
   `terraform.auto.tfvars` (gitignored).

### GitHub token permissions

Fine-grained PAT scoped to **only** `cqvo/wumbotechsite-svelte` (repository permissions):

| Permission     | Access         | Used by                                                                 |
| -------------- | -------------- | ----------------------------------------------------------------------- |
| Administration | Read and write | `github_repository` settings + `github_repository_ruleset`              |
| Metadata       | Read-only      | mandatory baseline (auto-selected)                                      |
| Variables      | Read and write | `github_actions_variable.*`                                             |
| Secrets        | Read and write | `github_actions_secret.vercel_token` — only if `ci_vercel_token` is set |

No organization/account permissions are needed (user-owned, repo-scoped). Contents,
Workflows, and Webhooks are not required.

## First run (import) + ongoing

```sh
cd terraform
tofu init      # configures the R2 backend (no prior state to migrate)
tofu plan      # KEY CHECK: imports resolve with NO destructive changes
tofu apply     # adopts the existing project/repo/domains/ruleset; writes state to R2
```

The `tofu plan` step is the safety gate: it should show the existing project/repo/ruleset
being _imported_ and reconciled to zero changes. The only _new_ resources are the Actions
variables (and the optional secret). **If you see unexpected modify/replace/destroy on the
imported resources, stop and tune the config — do not apply.**

After the first successful apply, open a follow-up commit removing the `import {}` blocks
in `imports.tf`. State is written to R2 automatically on every apply — nothing to commit.

### Fetch the env var ID (only if `PUBLIC_GTM_ID` already exists in Vercel)

List each env var's key + id (needs the Vercel token exported):

```sh
curl -s -H "Authorization: Bearer $TF_VAR_vercel_api_token" \
  "https://api.vercel.com/v9/projects/prj_ESMIJL9KI4jH8v2As0AC8vgDTdTI/env?teamId=team_hbvzY3Fd6qNjEiPHutKWYO2A" \
  | python3 -c "import sys, json; [print(e['key'], e['id']) for e in json.load(sys.stdin)['envs']]"
```

Put the `PUBLIC_GTM_ID` id into the `import` block in `imports.tf`. If `PUBLIC_GTM_ID` is
**not** listed, delete that import block — OpenTofu creates the variable from `gtm_id`.

## Notes

- **State backend:** Cloudflare R2 with `use_lockfile = true` (native locking). R2 only
  stores ciphertext because of OpenTofu client-side encryption.
- **Losing the passphrase = unrecoverable state.** 1Password is the durable copy.
- **Branch protection** is a repository ruleset ("Protect main") requiring the `verify`
  check; admins can bypass, so the owner is never locked out.
- Committed: `*.tf` and `.terraform.lock.hcl`. Never committed: state, `terraform.auto.tfvars`,
  `.terraform/`.
