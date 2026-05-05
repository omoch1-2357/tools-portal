import type { ToolCatalogItem, ToolPreference } from "./types";

export const ALL_TAG_FILTER = "all";

export type ToolPreferenceState = Record<string, ToolPreference>;

export type ToolFilterOptions = {
  searchText: string;
  activeTag: string;
  showFavoritesOnly: boolean;
  favoriteIds: ReadonlySet<string>;
};

export function getVisibleCatalogTools(tools: ToolCatalogItem[]) {
  return tools.filter((tool) => tool.visible);
}

export function getFavoriteToolIds(preferences: ToolPreferenceState) {
  const favoriteIds = new Set<string>();

  for (const [toolId, preference] of Object.entries(preferences)) {
    if (preference.favorite) {
      favoriteIds.add(toolId);
    }
  }

  return favoriteIds;
}

export function getAvailableTags(tools: ToolCatalogItem[]) {
  const tagSet = new Set<string>();

  for (const tool of tools) {
    for (const tag of tool.tags) {
      tagSet.add(tag);
    }
  }

  return [...tagSet].sort((firstTag, secondTag) => firstTag.localeCompare(secondTag));
}

export function filterCatalogTools(tools: ToolCatalogItem[], options: ToolFilterOptions) {
  const query = normalizeSearchText(options.searchText);

  return tools.filter((tool) => {
    if (options.showFavoritesOnly && !options.favoriteIds.has(tool.id)) {
      return false;
    }

    if (options.activeTag !== ALL_TAG_FILTER && !tool.tags.includes(options.activeTag)) {
      return false;
    }

    if (!query) {
      return true;
    }

    return matchesSearchQuery(tool, query);
  });
}

function normalizeSearchText(searchText: string) {
  return searchText.trim().toLowerCase();
}

function matchesSearchQuery(tool: ToolCatalogItem, query: string) {
  return [tool.name, tool.description, tool.tags.join(" ")].join(" ").toLowerCase().includes(query);
}
