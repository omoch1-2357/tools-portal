import { useMemo, useState } from "react";

import { signInWithGitHub, signOutUser } from "../features/auth/authClient";
import { useAuthState } from "../features/auth/useAuthState";
import {
  ALL_TAG_FILTER,
  filterCatalogTools,
  getAvailableTags,
  getFavoriteToolIds,
  getVisibleCatalogTools,
} from "../features/catalog/filterTools";
import { useToolCatalog } from "../features/catalog/useToolCatalog";
import { useToolPreferences } from "../features/preferences/useToolPreferences";
import { CatalogWorkspace } from "./components/CatalogWorkspace";
import { PortalHeader } from "./components/PortalHeader";
import { SidebarStatus } from "./components/SidebarStatus";
import { SyncPanel } from "./components/SyncPanel";

export function App() {
  const { user, loading: authLoading, authEnabled } = useAuthState();
  const { tools, loading: catalogLoading, error: catalogError, source } = useToolCatalog();
  const [searchText, setSearchText] = useState("");
  const [activeTag, setActiveTag] = useState<string>(ALL_TAG_FILTER);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const {
    state,
    loading: preferenceLoading,
    error: preferenceError,
    toggleFavorite,
    syncLocalToCloud,
    hasLocalData,
    lastSavedLabel,
  } = useToolPreferences(user, authEnabled);

  const visibleCatalogTools = useMemo(() => getVisibleCatalogTools(tools), [tools]);
  const favoriteIds = useMemo(() => getFavoriteToolIds(state), [state]);
  const availableTags = useMemo(() => getAvailableTags(visibleCatalogTools), [visibleCatalogTools]);

  const visibleTools = useMemo(() => {
    return filterCatalogTools(visibleCatalogTools, {
      searchText,
      activeTag,
      showFavoritesOnly,
      favoriteIds,
    });
  }, [activeTag, favoriteIds, searchText, showFavoritesOnly, visibleCatalogTools]);

  const favoriteCount = favoriteIds.size;
  const isLoading = catalogLoading || preferenceLoading;
  const catalogLabel = source === "firestore" ? "Firestore" : "Sample";
  const storageLabel = user ? "Cloud sync" : "Local only";

  return (
    <div className="portal-shell">
      <PortalHeader
        user={user}
        authLoading={authLoading}
        authEnabled={authEnabled}
        favoriteCount={favoriteCount}
        visibleToolCount={visibleCatalogTools.length}
        onSignIn={signInWithGitHub}
        onSignOut={signOutUser}
      />

      <main className="portal-layout">
        <aside className="portal-sidebar" aria-label="ポータル状態">
          <SidebarStatus
            visibleToolCount={visibleCatalogTools.length}
            favoriteCount={favoriteCount}
            catalogLabel={catalogLabel}
            storageLabel={storageLabel}
          />
          <SyncPanel
            signedIn={Boolean(user)}
            authEnabled={authEnabled}
            hasLocalData={hasLocalData}
            lastSavedLabel={lastSavedLabel}
            onSyncLocalToCloud={syncLocalToCloud}
          />
        </aside>

        <CatalogWorkspace
          tools={visibleTools}
          preferences={state}
          availableTags={availableTags}
          searchText={searchText}
          activeTag={activeTag}
          showFavoritesOnly={showFavoritesOnly}
          isLoading={isLoading}
          catalogError={catalogError}
          preferenceError={preferenceError}
          onSearchTextChange={setSearchText}
          onToggleFavoritesOnly={() => setShowFavoritesOnly((current) => !current)}
          onActiveTagChange={setActiveTag}
          onToggleFavorite={toggleFavorite}
        />
      </main>
    </div>
  );
}
