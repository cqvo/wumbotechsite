import { describe, it, expect } from "vitest";
import { useTranslations } from "./index";

describe("useTranslations", () => {
  it("returns English strings for the 'en' locale", () => {
    const t = useTranslations("en");
    expect(t.nav.home).toBe("Home");
  });

  it("defaults to English when no locale is given", () => {
    expect(useTranslations()).toBe(useTranslations("en"));
  });

  it("falls back to English for an unknown locale", () => {
    expect(useTranslations("zz")).toBe(useTranslations("en"));
  });
});
