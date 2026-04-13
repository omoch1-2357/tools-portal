import type { ToolPreference } from "../catalog/types";

const STORAGE_KEY = "tools-portal.preferences";

export function loadLocalPreferences(): Record<string, ToolPreference> {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Record<string, ToolPreference>;
    return parsedValue ?? {};
  } catch {
    return {};
  }
}

export function saveLocalPreferences(state: Record<string, ToolPreference>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearLocalPreferences() {
  window.localStorage.removeItem(STORAGE_KEY);
}
