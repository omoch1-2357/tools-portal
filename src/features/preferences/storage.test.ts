import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearLocalPreferences, loadLocalPreferences, saveLocalPreferences } from "./storage";

describe("preferences storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it("returns an empty object when no preferences are saved", () => {
    expect(loadLocalPreferences()).toEqual({});
  });

  it("round-trips saved preferences", () => {
    const state = {
      calculator: {
        favorite: true,
        favoriteUpdatedAt: "2026-05-01T00:00:00.000Z",
      },
    };

    expect(saveLocalPreferences(state)).toBe(true);
    expect(loadLocalPreferences()).toEqual(state);
  });

  it("falls back to legacy updatedAt values", () => {
    window.localStorage.setItem(
      "tools-portal.preferences",
      JSON.stringify({
        timer: {
          favorite: true,
          updatedAt: "2026-04-01T00:00:00.000Z",
        },
      }),
    );

    expect(loadLocalPreferences()).toEqual({
      timer: {
        favorite: true,
        favoriteUpdatedAt: "2026-04-01T00:00:00.000Z",
      },
    });
  });

  it("returns an empty object for malformed JSON", () => {
    window.localStorage.setItem("tools-portal.preferences", "{");

    expect(loadLocalPreferences()).toEqual({});
  });

  it("clears saved preferences", () => {
    expect(
      saveLocalPreferences({
        portal: {
          favorite: true,
          favoriteUpdatedAt: "2026-05-01T00:00:00.000Z",
        },
      }),
    ).toBe(true);

    expect(clearLocalPreferences()).toBe(true);
    expect(loadLocalPreferences()).toEqual({});
  });
});
