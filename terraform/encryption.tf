# OpenTofu native state encryption. State (and plan files) are encrypted at rest
# with AES-GCM, keyed by a PBKDF2-derived key from a passphrase.
#
# The encrypted state file IS committed to this (public) repo, so the ciphertext
# is publicly visible. That is only safe with a strong, high-entropy passphrase
# (>= 16 chars) — store it in 1Password and supply it via TF_VAR_state_passphrase
# on every `tofu` invocation. Lose it and the committed state is unrecoverable.
#
# Because the blob is public, iterations are raised above the 600k default to
# slow brute-force attempts against the passphrase.
terraform {
  encryption {
    key_provider "pbkdf2" "k" {
      passphrase = var.state_passphrase
      iterations = 1000000
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
