// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  GRANTED_STATE,
  DENIED_STATE,
  CONSENT_KEY,
  parseStoredConsent,
} from "./consent-state";

// Keep the gated loaders from doing real work when analytics is granted.
vi.mock("@amplitude/unified", () => ({ initAll: vi.fn() }));
vi.mock("@vercel/speed-insights", () => ({ injectSpeedInsights: vi.fn() }));

// Importing the manager registers its astro:after-swap listener and runs setup()
// once (no banner in the DOM yet, so it's a no-op).
import "./consent";

function buildBanner(): HTMLElement {
  document.body.innerHTML = `
    <div id="consent-banner" data-prod="false" class="hidden">
      <button id="consent-reject"></button>
      <button id="consent-accept"></button>
    </div>`;
  return document.querySelector<HTMLElement>("#consent-banner")!;
}

// Re-run consent.ts's setup() via the listener it registered on import.
function runSetup(): void {
  document.dispatchEvent(new Event("astro:after-swap"));
}

function consentCommands(): unknown[][] {
  return (window.dataLayer ?? []).filter(
    (entry): entry is unknown[] =>
      Array.isArray(entry) && entry[0] === "consent"
  );
}

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = "";
  window.__gtmLoaded = undefined;
  window.__consentLoaded = undefined;
  window.dataLayer = undefined;
});

describe("consent manager (DOM)", () => {
  it("reveals the banner and sets the Consent Mode default when no choice is stored", () => {
    const banner = buildBanner();
    runSetup();

    expect(banner.classList.contains("hidden")).toBe(false);

    const defaults = consentCommands().filter(c => c[1] === "default");
    expect(defaults).toHaveLength(1);
    const params = defaults[0][2] as Record<string, unknown>;
    expect(params.analytics_storage).toBe("denied");
    expect(params.security_storage).toBe("granted");
    expect(params.wait_for_update).toBe(500);
  });

  it("stores all granted purposes and pushes a consent update on Accept", () => {
    const banner = buildBanner();
    runSetup();

    document.querySelector<HTMLButtonElement>("#consent-accept")!.click();

    expect(parseStoredConsent(localStorage.getItem(CONSENT_KEY))).toEqual(
      GRANTED_STATE
    );
    expect(banner.classList.contains("hidden")).toBe(true);

    const updates = consentCommands().filter(c => c[1] === "update");
    expect(updates.at(-1)![2]).toEqual(GRANTED_STATE);
  });

  it("stores denied purposes (security granted) and pushes a consent update on Reject", () => {
    buildBanner();
    runSetup();

    document.querySelector<HTMLButtonElement>("#consent-reject")!.click();

    const stored = parseStoredConsent(localStorage.getItem(CONSENT_KEY));
    expect(stored).toEqual(DENIED_STATE);
    expect(stored!.security_storage).toBe("granted");

    const updates = consentCommands().filter(c => c[1] === "update");
    expect(updates.at(-1)![2]).toEqual(DENIED_STATE);
  });

  it("keeps the banner hidden and applies a stored choice on load", () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(GRANTED_STATE));
    const banner = buildBanner();
    runSetup();

    expect(banner.classList.contains("hidden")).toBe(true);

    const updates = consentCommands().filter(c => c[1] === "update");
    expect(updates.at(-1)![2]).toEqual(GRANTED_STATE);
  });
});
