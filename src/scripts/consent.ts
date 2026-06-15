// Consent manager. GTM loads unconditionally; Amplitude and Vercel Speed
// Insights load only after the visitor explicitly accepts (opt-in). The choice
// is persisted in localStorage, mirroring the theme-toggle pattern in theme.ts.
import { PUBLIC_GTM_ID, PUBLIC_AMPLITUDE_API_KEY } from "astro:env/client";

const CONSENT_KEY = "consent";
const GRANTED = "granted";
const DENIED = "denied";
// Public Amplitude demo key, used when PUBLIC_AMPLITUDE_API_KEY is unset.
const AMPLITUDE_FALLBACK_KEY = "bf6f5ee6de23eeb0b2fd7facbe621e33";

type ConsentValue = typeof GRANTED | typeof DENIED;

declare global {
  interface Window {
    __gtmLoaded?: boolean;
    __consentLoaded?: boolean;
    dataLayer?: unknown[];
  }
}

function getConsent(): string | null {
  return localStorage.getItem(CONSENT_KEY);
}

function setConsent(value: ConsentValue): void {
  localStorage.setItem(CONSENT_KEY, value);
}

function loadGtm(): void {
  if (!PUBLIC_GTM_ID || window.__gtmLoaded) return;
  window.__gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
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

// Load consent-gated analytics once. Guarded so View Transitions navigation
// never double-initializes them.
function loadConsentedAnalytics(isProd: boolean): void {
  if (window.__consentLoaded) return;
  window.__consentLoaded = true;
  void loadAmplitude();
  void loadSpeedInsights(isProd);
}

function setup(): void {
  const banner = document.querySelector<HTMLElement>("#consent-banner");
  if (!banner) return;

  const isProd = banner.dataset.prod === "true";

  // GTM always loads regardless of consent choice.
  loadGtm();

  const consent = getConsent();

  if (consent === GRANTED) {
    loadConsentedAnalytics(isProd);
    return;
  }
  if (consent === DENIED) return;

  // No choice yet — reveal the banner and wait for the visitor's input.
  banner.classList.remove("hidden");

  banner.querySelector("#consent-accept")?.addEventListener("click", () => {
    setConsent(GRANTED);
    banner.classList.add("hidden");
    loadConsentedAnalytics(isProd);
  });
  banner.querySelector("#consent-reject")?.addEventListener("click", () => {
    setConsent(DENIED);
    banner.classList.add("hidden");
  });
}

setup();

// Re-run after View Transitions navigation (the banner lives in <body>, which
// the <ClientRouter /> swaps).
document.addEventListener("astro:after-swap", setup);
