import type { ToolPreference } from "../catalog/types";

export const STORAGE_KEY = "tools-portal.preferences";

export type StorageLike = Pick<Storage, "getItem" | "removeItem" | "setItem">;

function getDefaultStorage(): StorageLike | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function safeGetItem(storage: StorageLike | null, key: string) {
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(storage: StorageLike | null, key: string, value: string) {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveItem(storage: StorageLike | null, key: string) {
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function loadLocalPreferences(
  storage: StorageLike | null = getDefaultStorage(),
): Record<string, ToolPreference> {
  const rawValue = safeGetItem(storage, STORAGE_KEY);

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

export function saveLocalPreferences(
  state: Record<string, ToolPreference>,
  storage: StorageLike | null = getDefaultStorage(),
) {
  return safeSetItem(storage, STORAGE_KEY, JSON.stringify(state));
}

export function clearLocalPreferences(storage: StorageLike | null = getDefaultStorage()) {
  return safeRemoveItem(storage, STORAGE_KEY);
}
