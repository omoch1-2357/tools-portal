import { describe, expect, it } from "vitest";

import {
  ALL_TAG_FILTER,
  filterCatalogTools,
  getAvailableTags,
  getFavoriteToolIds,
  getVisibleCatalogTools,
} from "./filterTools";
import type { ToolCatalogItem, ToolPreference } from "./types";

const tools: ToolCatalogItem[] = [
  tool({
    id: "text",
    name: "Text Formatter",
    description: "Format and clean text",
    tags: ["text", "format"],
    visible: true,
  }),
  tool({
    id: "image",
    name: "Image Optimizer",
    description: "Compress image assets",
    tags: ["image", "asset"],
    visible: true,
  }),
  tool({
    id: "hidden",
    name: "Hidden Tool",
    description: "Internal only",
    tags: ["internal"],
    visible: false,
  }),
];

describe("catalog filter helpers", () => {
  it("keeps only visible catalog tools", () => {
    expect(getVisibleCatalogTools(tools).map((item) => item.id)).toEqual(["text", "image"]);
  });

  it("extracts favorite tool ids from preference state", () => {
    const preferences: Record<string, ToolPreference> = {
      text: preference(true),
      image: preference(false),
    };

    expect([...getFavoriteToolIds(preferences)]).toEqual(["text"]);
  });

  it("builds a sorted unique tag list from visible tools", () => {
    expect(getAvailableTags(getVisibleCatalogTools(tools))).toEqual([
      "asset",
      "format",
      "image",
      "text",
    ]);
  });

  it("filters by search text across name, description, and tags", () => {
    expect(
      filterCatalogTools(getVisibleCatalogTools(tools), {
        searchText: "ASSET",
        activeTag: ALL_TAG_FILTER,
        showFavoritesOnly: false,
        favoriteIds: new Set(),
      }).map((item) => item.id),
    ).toEqual(["image"]);
  });

  it("combines tag and favorites filters", () => {
    expect(
      filterCatalogTools(getVisibleCatalogTools(tools), {
        searchText: "",
        activeTag: "text",
        showFavoritesOnly: true,
        favoriteIds: new Set(["text", "image"]),
      }).map((item) => item.id),
    ).toEqual(["text"]);
  });

  it("returns no tools when filters do not match", () => {
    expect(
      filterCatalogTools(getVisibleCatalogTools(tools), {
        searchText: "missing",
        activeTag: ALL_TAG_FILTER,
        showFavoritesOnly: false,
        favoriteIds: new Set(),
      }),
    ).toEqual([]);
  });
});

function tool(overrides: Partial<ToolCatalogItem>): ToolCatalogItem {
  return {
    id: "tool",
    name: "Tool",
    description: "",
    url: "#",
    repo: "tool",
    tags: [],
    visible: true,
    sortOrder: 10,
    ...overrides,
  };
}

function preference(favorite: boolean): ToolPreference {
  return {
    favorite,
    favoriteUpdatedAt: "2026-05-01T00:00:00.000Z",
  };
}
