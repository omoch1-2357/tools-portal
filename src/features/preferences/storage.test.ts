import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearLocalPreferences,
  loadLocalPreferences,
  saveLocalPreferences,
  STORAGE_KEY,
  type StorageLike,
} from "./storage";

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => {
      values.delete(key);
    },
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}

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
      STORAGE_KEY,
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
    window.localStorage.setItem(STORAGE_KEY, "{");

    expect(loadLocalPreferences()).toEqual({});
  });

  it("can use an injected Storage-like adapter", () => {
    const storage = createMemoryStorage();
    const state = {
      clock: {
        favorite: true,
        favoriteUpdatedAt: "2026-05-01T00:00:00.000Z",
      },
    };

    expect(saveLocalPreferences(state, storage)).toBe(true);
    expect(loadLocalPreferences(storage)).toEqual(state);
    expect(clearLocalPreferences(storage)).toBe(true);
    expect(loadLocalPreferences(storage)).toEqual({});
  });

  it("reports write failures from injected storage", () => {
    const storage: StorageLike = {
      getItem: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new Error("blocked");
      },
    };

    expect(saveLocalPreferences({}, storage)).toBe(false);
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
