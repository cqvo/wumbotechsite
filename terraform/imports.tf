# Declarative import blocks (OpenTofu 1.5+) adopt the already-existing resources
# so `tofu plan` shows them being imported rather than created. Run `tofu plan`
# and drive the diff to zero by tuning the resource config above before applying.
#
# Resources created fresh (no import): github_actions_variable.*,
# github_actions_secret.vercel_token.

import {
  to = vercel_project.site
  id = "team_hbvzY3Fd6qNjEiPHutKWYO2A/prj_ESMIJL9KI4jH8v2As0AC8vgDTdTI"
}

import {
  to = vercel_project_domain.apex
  id = "team_hbvzY3Fd6qNjEiPHutKWYO2A/prj_ESMIJL9KI4jH8v2As0AC8vgDTdTI/wumbo.tech"
}

import {
  to = vercel_project_domain.www
  id = "team_hbvzY3Fd6qNjEiPHutKWYO2A/prj_ESMIJL9KI4jH8v2As0AC8vgDTdTI/www.wumbo.tech"
}

import {
  to = github_repository.site
  id = "wumbotechsite-svelte"
}

# Existing "Protect main" repository ruleset.
import {
  to = github_repository_ruleset.main
  id = "wumbotechsite-svelte:17300958"
}

# PUBLIC_GTM_ID env var. The ID is fetched with the Vercel token (see README
# "Fetch the env var ID"). If PUBLIC_GTM_ID is NOT set in Vercel, delete this
# block — OpenTofu will create it from var.gtm_id instead.
import {
  to = vercel_project_environment_variable.public_gtm_id
  id = "team_hbvzY3Fd6qNjEiPHutKWYO2A/prj_ESMIJL9KI4jH8v2As0AC8vgDTdTI/<ENV_VAR_ID>"
}
