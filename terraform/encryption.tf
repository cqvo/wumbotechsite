# OpenTofu native state encryption. State (and plan files) are encrypted at rest
# with AES-GCM, keyed by a PBKDF2-derived key from a passphrase.
#
# The passphrase MUST be supplied via the TF_VAR_state_passphrase environment
# variable on every `tofu` invocation. Lose it and the state is unrecoverable,
# so store it somewhere durable (password manager).
terraform {
  encryption {
    key_provider "pbkdf2" "k" {
      passphrase = var.state_passphrase
    }

    method "aes_gcm" "m" {
      keys = key_provider.pbkdf2.k
    }

    state {
      method = method.aes_gcm.m
    }

    plan {
      method = method.aes_gcm.m
    }
  }
}
