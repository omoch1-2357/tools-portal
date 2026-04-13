import type { User } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import type { ToolPreference } from "../catalog/types";
import {
  clearLocalPreferences,
  loadLocalPreferences,
  saveLocalPreferences,
} from "./storage";
import {
  fetchUserPreferences,
  savePreference,
  savePreferenceBatch,
} from "./preferencesService";

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

export function useToolPreferences(user: User | null, authEnabled: boolean): UseToolPreferencesResult {
  const [state, setState] = useState<ToolPreferenceState>({});
  const [loading, setLoading] = useState(authEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user) {
        setState(loadLocalPreferences());
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
      .map((value) => Date.parse(value.updatedAt))
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
        updatedAt: new Date().toISOString(),
      },
    };

    setState(nextState);
    setError(null);

    try {
      if (user) {
        await savePreference(user, toolId, nextState[toolId]);
        return;
      }

      saveLocalPreferences(nextState);
    } catch (error) {
      setError(error instanceof Error ? error.message : "保存に失敗しました。");
    }
  }

  async function syncLocalToCloud() {
    if (!user) {
      return;
    }

    const localState = loadLocalPreferences();
    if (Object.keys(localState).length === 0) {
      return;
    }

    try {
      await savePreferenceBatch(user, localState);
      clearLocalPreferences();
      setState((currentState) => ({ ...currentState, ...localState }));
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
    hasLocalData: Object.keys(loadLocalPreferences()).length > 0,
    lastSavedLabel,
  };
}
