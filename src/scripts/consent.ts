// Consent manager. GTM loads unconditionally and receives Google Consent Mode
// v2 signals (default denied → updated on the visitor's choice). Amplitude and
// Vercel Speed Insights load only when analytics_storage is granted. The choice
// is persisted in localStorage as a full map of all Consent Mode v2 purposes,
// mirroring the theme-toggle pattern in theme.ts.
//
// The pure state logic (purpose map, parsing, gating) lives in consent-state.ts
// so it can be unit-tested without a DOM or astro:env.
import { PUBLIC_GTM_ID, PUBLIC_AMPLITUDE_API_KEY } from "astro:env/client";
import {
  CONSENT_KEY,
  GRANTED_STATE,
  DENIED_STATE,
  type ConsentState,
  parseStoredConsent,
  analyticsAllowed,
  consentDefaultParams,
} from "./consent-state";

// Public Amplitude demo key, used when PUBLIC_AMPLITUDE_API_KEY is unset.
const AMPLITUDE_FALLBACK_KEY = "bf6f5ee6de23eeb0b2fd7facbe621e33";

declare global {
  interface Window {
    __gtmLoaded?: boolean;
    __consentLoaded?: boolean;
    dataLayer?: unknown[];
  }
}

function getConsent(): ConsentState | null {
  return parseStoredConsent(localStorage.getItem(CONSENT_KEY));
}

function setConsent(state: ConsentState): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
}

// Consent Mode helper. Google's gtag() shim pushes its `arguments` object onto
// the dataLayer; pushing the equivalent array is functionally identical (GTM
// only reads positional entries) and keeps this fully typed.
function gtag(...args: unknown[]): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

function loadGtm(stored: ConsentState | null): void {
  if (!PUBLIC_GTM_ID || window.__gtmLoaded) return;
  window.__gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];

  // Consent Mode v2: default every purpose to denied before GTM initializes,
  // then immediately apply a returning visitor's saved choice.
  gtag("consent", "default", consentDefaultParams());
  if (stored) gtag("consent", "update", stored);

  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${PUBLIC_GTM_ID}`;
  document.head.appendChild(script);
}

async function loadAmplitude(): Promise<void> {
  const amplitude = await import("@amplitude/unified");
  const apiKey = PUBLIC_AMPLITUDE_API_KEY ?? AMPLITUDE_FALLBACK_KEY;
  amplitude.initAll(apiKey, { analytics: { autocapture: true } });
}

async function loadSpeedInsights(isProd: boolean): Promise<void> {
  if (!isProd) return;
  const { injectSpeedInsights } = await import("@vercel/speed-insights");
  injectSpeedInsights();
}

// Load the analytics_storage-gated tools once. Guarded so View Transitions
// navigation never double-initializes them.
function loadConsentedAnalytics(state: ConsentState, isProd: boolean): void {
  if (!analyticsAllowed(state)) return;
  if (window.__consentLoaded) return;
  window.__consentLoaded = true;
  void loadAmplitude();
  void loadSpeedInsights(isProd);
}

function setup(): void {
  const banner = document.querySelector<HTMLElement>("#consent-banner");
  if (!banner) return;

  const isProd = banner.dataset.prod === "true";
  const stored = getConsent();

  // GTM always loads; its Consent Mode signals reflect the stored choice.
  loadGtm(stored);

  if (stored) {
    loadConsentedAnalytics(stored, isProd);
    return;
  }

  // No choice yet — reveal the banner and wait for the visitor's input.
  banner.classList.remove("hidden");

  const choose = (state: ConsentState) => {
    setConsent(state);
    gtag("consent", "update", state);
    banner.classList.add("hidden");
    loadConsentedAnalytics(state, isProd);
  };

  banner
    .querySelector("#consent-accept")
    ?.addEventListener("click", () => choose(GRANTED_STATE));
  banner
    .querySelector("#consent-reject")
    ?.addEventListener("click", () => choose(DENIED_STATE));
}

setup();

// Re-run after View Transitions navigation (the banner lives in <body>, which
// the <ClientRouter /> swaps).
document.addEventListener("astro:after-swap", setup);
