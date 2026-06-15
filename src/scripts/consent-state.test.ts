import { describe, it, expect } from "vitest";
import {
  PURPOSES,
  makeState,
  GRANTED_STATE,
  DENIED_STATE,
  parseStoredConsent,
  analyticsAllowed,
  consentDefaultParams,
  CONSENT_WAIT_FOR_UPDATE,
} from "./consent-state";

describe("makeState", () => {
  it("grants every purpose for 'granted'", () => {
    const state = makeState("granted");
    for (const purpose of PURPOSES) {
      expect(state[purpose]).toBe("granted");
    }
  });

  it("denies every purpose for 'denied' except the necessary security_storage", () => {
    const state = makeState("denied");
    for (const purpose of PURPOSES) {
      const expected = purpose === "security_storage" ? "granted" : "denied";
      expect(state[purpose]).toBe(expected);
    }
  });

  it("exposes all seven purposes on the derived states", () => {
    expect(Object.keys(GRANTED_STATE).sort()).toEqual([...PURPOSES].sort());
    expect(Object.keys(DENIED_STATE).sort()).toEqual([...PURPOSES].sort());
  });
});

describe("parseStoredConsent", () => {
  it("returns null for absent or empty values", () => {
    expect(parseStoredConsent(null)).toBeNull();
    expect(parseStoredConsent("")).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    expect(parseStoredConsent("garbage")).toBeNull();
    expect(parseStoredConsent("{")).toBeNull();
  });

  it("returns null for legacy 'granted'/'denied' string values", () => {
    expect(parseStoredConsent(JSON.stringify("granted"))).toBeNull();
    expect(parseStoredConsent(JSON.stringify("denied"))).toBeNull();
  });

  it("returns null when a purpose key is missing", () => {
    const partial: Record<string, unknown> = { ...GRANTED_STATE };
    delete partial.security_storage;
    expect(parseStoredConsent(JSON.stringify(partial))).toBeNull();
  });

  it("parses a complete consent object", () => {
    expect(parseStoredConsent(JSON.stringify(GRANTED_STATE))).toEqual(
      GRANTED_STATE
    );
    expect(parseStoredConsent(JSON.stringify(DENIED_STATE))).toEqual(
      DENIED_STATE
    );
  });

  it("round-trips a state through serialize/parse", () => {
    const raw = JSON.stringify(GRANTED_STATE);
    expect(parseStoredConsent(raw)).toEqual(GRANTED_STATE);
  });
});

describe("analyticsAllowed", () => {
  it("is true only when analytics_storage is granted", () => {
    expect(analyticsAllowed(GRANTED_STATE)).toBe(true);
    expect(analyticsAllowed(DENIED_STATE)).toBe(false);
  });

  it("keys solely off analytics_storage, not other purposes", () => {
    const mixed = { ...DENIED_STATE, analytics_storage: "granted" as const };
    expect(analyticsAllowed(mixed)).toBe(true);
  });
});

describe("consentDefaultParams", () => {
  it("denies every purpose except security_storage and sets wait_for_update", () => {
    const params = consentDefaultParams();
    expect(params.wait_for_update).toBe(CONSENT_WAIT_FOR_UPDATE);
    for (const purpose of PURPOSES) {
      const expected = purpose === "security_storage" ? "granted" : "denied";
      expect(params[purpose]).toBe(expected);
    }
  });
});
