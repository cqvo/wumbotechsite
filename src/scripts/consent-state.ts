// Pure, framework-free consent-state logic shared by the consent manager
// (src/scripts/consent.ts) and its tests. Nothing here touches the DOM,
// localStorage, or astro:env, so it can be unit-tested in a plain Node env.

export const CONSENT_KEY = "consent";

// Consent Mode's default state stays "denied" for up to this many ms while it
// waits for an update() reflecting the visitor's stored/chosen consent.
export const CONSENT_WAIT_FOR_UPDATE = 500;

// The seven Google Consent Mode v2 consent signals.
export const PURPOSES = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
  "functionality_storage",
  "personalization_storage",
  "security_storage",
] as const;

export type Purpose = (typeof PURPOSES)[number];
export type ConsentSignal = "granted" | "denied";
export type ConsentState = Record<Purpose, ConsentSignal>;

// Build a full purpose map. security_storage is strictly necessary, so it is
// always granted regardless of the visitor's choice.
export function makeState(signal: ConsentSignal): ConsentState {
  return PURPOSES.reduce((acc, purpose) => {
    acc[purpose] = purpose === "security_storage" ? "granted" : signal;
    return acc;
  }, {} as ConsentState);
}

export const GRANTED_STATE = makeState("granted");
export const DENIED_STATE = makeState("denied");

// Parse a stored consent value into a full ConsentState, or null when it is
// absent, malformed, or a legacy ("granted"/"denied") string.
export function parseStoredConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      PURPOSES.every(purpose => purpose in parsed)
    ) {
      return parsed as ConsentState;
    }
  } catch {
    // Malformed or legacy value — treat as no choice.
  }
  return null;
}

// Whether analytics tooling (Amplitude, Speed Insights) may load.
export function analyticsAllowed(state: ConsentState): boolean {
  return state.analytics_storage === "granted";
}

// The Consent Mode v2 default params: everything denied (security granted),
// with a grace window for the follow-up update().
export function consentDefaultParams(): Record<string, unknown> {
  return { ...DENIED_STATE, wait_for_update: CONSENT_WAIT_FOR_UPDATE };
}
