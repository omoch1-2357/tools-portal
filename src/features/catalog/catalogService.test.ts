import { describe, expect, it } from "vitest";

import {
  type FirestoreDocument,
  mapToolDocument,
  sortCatalogTools,
  toolsCollectionPath,
} from "./catalogService";
import type { ToolCatalogItem } from "./types";

function timestamp(date: string) {
  return {
    toDate: () => new Date(date),
  };
}

describe("catalog persistence helpers", () => {
  it("keeps the Firestore collection path stable", () => {
    expect(toolsCollectionPath).toBe("tools");
  });

  it("maps Firestore document data into catalog items", () => {
    const document: FirestoreDocument = {
      id: "text-tool",
      data: {
        name: "Text Tool",
        description: "Formats text",
        url: "https://example.com/text-tool",
        repo: "owner/text-tool",
        tags: ["text", 1, "format"],
        visible: true,
        sortOrder: 20,
        updatedAt: timestamp("2026-05-01T00:00:00.000Z"),
      },
    };

    expect(mapToolDocument(document)).toEqual({
      id: "text-tool",
      name: "Text Tool",
      description: "Formats text",
      url: "https://example.com/text-tool",
      repo: "owner/text-tool",
      tags: ["text", "format"],
      visible: true,
      sortOrder: 20,
      updatedAt: "2026-05-01T00:00:00.000Z",
    });
  });

  it("uses schema-compatible defaults for missing optional fields", () => {
    expect(mapToolDocument({ id: "fallback", data: {} })).toEqual({
      id: "fallback",
      name: "fallback",
      description: "",
      url: "#",
      repo: "fallback",
      tags: [],
      visible: true,
      sortOrder: 9999,
      updatedAt: undefined,
    });
  });

  it("sorts by sortOrder and then localized name", () => {
    const tools: ToolCatalogItem[] = [
      {
        id: "z",
        name: "Zulu",
        description: "",
        url: "#",
        repo: "z",
        tags: [],
        visible: true,
        sortOrder: 20,
      },
      {
        id: "a",
        name: "Alpha",
        description: "",
        url: "#",
        repo: "a",
        tags: [],
        visible: true,
        sortOrder: 20,
      },
      {
        id: "first",
        name: "First",
        description: "",
        url: "#",
        repo: "first",
        tags: [],
        visible: true,
        sortOrder: 10,
      },
    ];

    expect(sortCatalogTools(tools).map((tool) => tool.id)).toEqual(["first", "a", "z"]);
  });
});
