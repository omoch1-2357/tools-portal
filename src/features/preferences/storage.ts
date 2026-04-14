import type { ToolPreference } from "../catalog/types";

const STORAGE_KEY = "tools-portal.preferences";

function safeGetItem(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveItem(key: string) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function loadLocalPreferences(): Record<string, ToolPreference> {
  const rawValue = safeGetItem(STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Record<
      string,
      ToolPreference & { updatedAt?: string }
    >;

    return Object.fromEntries(
      Object.entries(parsedValue ?? {}).map(([toolId, preference]) => [
        toolId,
        {
          favorite: preference.favorite === true,
          favoriteUpdatedAt:
            typeof preference.favoriteUpdatedAt === "string"
              ? preference.favoriteUpdatedAt
              : typeof preference.updatedAt === "string"
                ? preference.updatedAt
                : new Date().toISOString(),
        },
      ]),
    );
  } catch {
    return {};
  }
}

export function saveLocalPreferences(state: Record<string, ToolPreference>) {
  return safeSetItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearLocalPreferences() {
  return safeRemoveItem(STORAGE_KEY);
}
