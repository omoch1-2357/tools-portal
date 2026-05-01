import type { User } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";

import type { ToolPreference } from "../catalog/types";
import { fetchUserPreferences, savePreference, savePreferenceBatch } from "./preferencesService";
import { clearLocalPreferences, loadLocalPreferences, saveLocalPreferences } from "./storage";

type ToolPreferenceState = Record<string, ToolPreference>;

type UseToolPreferencesResult = {
  state: ToolPreferenceState;
  loading: boolean;
  error: string | null;
  toggleFavorite: (toolId: string) => Promise<void>;
  syncLocalToCloud: () => Promise<void>;
  hasLocalData: boolean;
  lastSavedLabel: string | null;
};

export function useToolPreferences(
  user: User | null,
  authEnabled: boolean,
): UseToolPreferencesResult {
  const [state, setState] = useState<ToolPreferenceState>({});
  const [localStateCache, setLocalStateCache] = useState<ToolPreferenceState>({});
  const [loading, setLoading] = useState(authEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const nextLocalState = loadLocalPreferences();
      if (active) {
        setLocalStateCache(nextLocalState);
      }

      if (!user) {
        setState(nextLocalState);
        setLoading(false);
        return;
      }

      try {
        const cloudState = await fetchUserPreferences(user);
        if (!active) {
          return;
        }

        setState(cloudState);
        setError(null);
      } catch (error) {
        if (active) {
          setError(error instanceof Error ? error.message : "保存状態の取得に失敗しました。");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [user]);

  const lastSavedLabel = useMemo(() => {
    const timestamps = Object.values(state)
      .map((value) => Date.parse(value.favoriteUpdatedAt))
      .filter((value) => !Number.isNaN(value));

    if (timestamps.length === 0) {
      return null;
    }

    return new Date(Math.max(...timestamps)).toLocaleString("ja-JP");
  }, [state]);

  async function toggleFavorite(toolId: string) {
    const nextState = {
      ...state,
      [toolId]: {
        favorite: !state[toolId]?.favorite,
        favoriteUpdatedAt: new Date().toISOString(),
      },
    };

    setState(nextState);
    setError(null);

    try {
      if (user) {
        await savePreference(user, toolId, nextState[toolId]);
        return;
      }

      if (!saveLocalPreferences(nextState)) {
        throw new Error("この環境ではローカル保存できませんでした。");
      }
      setLocalStateCache(nextState);
    } catch (error) {
      setError(error instanceof Error ? error.message : "保存に失敗しました。");
    }
  }

  async function syncLocalToCloud() {
    if (!user) {
      return;
    }

    if (Object.keys(localStateCache).length === 0) {
      return;
    }

    try {
      await savePreferenceBatch(user, localStateCache);
      clearLocalPreferences();
      setLocalStateCache({});
      setState((currentState) => ({ ...currentState, ...localStateCache }));
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "クラウド同期に失敗しました。");
    }
  }

  return {
    state,
    loading,
    error,
    toggleFavorite,
    syncLocalToCloud,
    hasLocalData: Object.keys(localStateCache).length > 0,
    lastSavedLabel,
  };
}
