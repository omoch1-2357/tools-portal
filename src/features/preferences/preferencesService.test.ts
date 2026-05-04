import { describe, expect, it } from "vitest";

import {
  mapPreferenceDocument,
  preferenceWriteData,
  userAppsCollectionPath,
  userPreferenceDocumentPath,
} from "./preferencesService";

function timestamp(date: string) {
  return {
    toDate: () => new Date(date),
  };
}

describe("preferences persistence helpers", () => {
  it("keeps Firestore paths stable", () => {
    expect(userAppsCollectionPath("user-1")).toEqual(["users", "user-1", "apps"]);
    expect(userPreferenceDocumentPath("user-1", "tool-1")).toEqual([
      "users",
      "user-1",
      "apps",
      "tool-1",
    ]);
  });

  it("maps valid preference documents", () => {
    expect(
      mapPreferenceDocument({
        id: "tool-1",
        data: {
          favorite: true,
          favoriteUpdatedAt: timestamp("2026-05-01T00:00:00.000Z"),
        },
      }),
    ).toEqual({
      favorite: true,
      favoriteUpdatedAt: "2026-05-01T00:00:00.000Z",
    });
  });

  it("ignores documents without a boolean favorite flag", () => {
    expect(
      mapPreferenceDocument({
        id: "tool-1",
        data: {
          favorite: "true",
        },
      }),
    ).toBeNull();
  });

  it("uses the legacy fallback timestamp when Firestore timestamp is absent", () => {
    expect(
      mapPreferenceDocument({
        id: "tool-1",
        data: {
          favorite: false,
        },
      }),
    ).toEqual({
      favorite: false,
      favoriteUpdatedAt: new Date(0).toISOString(),
    });
  });

  it("builds write payloads without changing the Firestore schema", () => {
    const serverTimestampValue = { sentinel: "serverTimestamp" };

    expect(
      preferenceWriteData(
        {
          favorite: true,
          favoriteUpdatedAt: "client-only",
        },
        serverTimestampValue,
      ),
    ).toEqual({
      favorite: true,
      favoriteUpdatedAt: serverTimestampValue,
    });
  });
});
