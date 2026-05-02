import { useMemo, useState } from "react";

import { signInWithGitHub, signOutUser } from "../features/auth/authClient";
import { useAuthState } from "../features/auth/useAuthState";
import { ToolCard } from "../features/catalog/ToolCard";
import { useToolCatalog } from "../features/catalog/useToolCatalog";
import { useToolPreferences } from "../features/preferences/useToolPreferences";

export function App() {
  const { user, loading: authLoading, authEnabled } = useAuthState();
  const { tools, loading: catalogLoading, error: catalogError, source } = useToolCatalog();
  const [searchText, setSearchText] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");
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

  const visibleCatalogTools = useMemo(() => tools.filter((tool) => tool.visible), [tools]);

  const favoriteIds = useMemo(
    () =>
      new Set(
        Object.entries(state)
          .filter(([, entry]) => entry.favorite)
          .map(([toolId]) => toolId),
      ),
    [state],
  );

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();

    for (const tool of visibleCatalogTools) {
      for (const tag of tool.tags) {
        tagSet.add(tag);
      }
    }

    return [...tagSet].sort((firstTag, secondTag) => firstTag.localeCompare(secondTag));
  }, [visibleCatalogTools]);

  const visibleTools = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return visibleCatalogTools.filter((tool) => {
      if (showFavoritesOnly && !favoriteIds.has(tool.id)) {
        return false;
      }

      if (activeTag !== "all" && !tool.tags.includes(activeTag)) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [tool.name, tool.description, tool.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [activeTag, favoriteIds, searchText, showFavoritesOnly, visibleCatalogTools]);

  const favoriteCount = favoriteIds.size;
  const isLoading = catalogLoading || preferenceLoading;
  const catalogLabel = source === "firestore" ? "Firestore" : "Sample";
  const storageLabel = user ? "Cloud sync" : "Local only";
  const userLabel = user?.displayName ?? user?.email ?? "Signed in";

  return (
    <div className="portal-shell">
      <header className="portal-topbar">
        <div>
          <p className="portal-kicker">Tools Portal</p>
          <h1>ツールを探して、保存して、すぐ開く。</h1>
        </div>
        <div className="portal-account" aria-live="polite">
          {authLoading ? (
            <span>認証確認中</span>
          ) : user ? (
            <>
              <span>{userLabel}</span>
              <button className="button button--quiet" onClick={signOutUser} type="button">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <span>未ログイン</span>
              <button
                className="button button--primary"
                onClick={signInWithGitHub}
                disabled={!authEnabled}
                type="button"
              >
                GitHub ログイン
              </button>
            </>
          )}
        </div>
      </header>

      <main className="portal-layout">
        <aside className="portal-sidebar" aria-label="ポータル状態">
          <section className="summary-panel">
            <div className="metric-list">
              <StatusBlock label="表示ツール" value={String(visibleCatalogTools.length)} />
              <StatusBlock label="保存済み" value={String(favoriteCount)} />
              <StatusBlock label="カタログ" value={catalogLabel} />
              <StatusBlock label="保存先" value={storageLabel} />
            </div>
          </section>

          <section className="sync-panel">
            <div>
              <h2>保存状態</h2>
              <p>
                {user
                  ? "お気に入りはクラウドに保存されます。"
                  : "ログインなしでも、この端末に保存できます。"}
              </p>
              {lastSavedLabel ? <p className="save-time">最終保存: {lastSavedLabel}</p> : null}
            </div>

            {user ? (
              <button
                className="button button--primary"
                onClick={syncLocalToCloud}
                disabled={!hasLocalData}
                type="button"
              >
                ローカル保存を同期
              </button>
            ) : (
              <p className="inline-notice">
                端末間で同期する場合は GitHub ログインを使います。
              </p>
            )}
            {!authEnabled ? (
              <p className="inline-warning">Firebase 設定未投入のため認証は無効です。</p>
            ) : null}
          </section>
        </aside>

        <section className="workspace" aria-labelledby="tools-heading">
          <div className="workspace-header">
            <div>
              <p className="section-label">Catalog</p>
              <h2 id="tools-heading">ツール一覧</h2>
            </div>
            <div className="result-count" aria-live="polite">
              {isLoading ? "読み込み中" : `${visibleTools.length} 件`}
            </div>
          </div>

          <div className="search-panel">
            <label className="search-field">
              <span className="sr-only">名前、説明、タグで検索</span>
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="名前、説明、タグで検索"
                type="search"
              />
            </label>
            <button
              className={`filter-toggle${showFavoritesOnly ? " is-active" : ""}`}
              onClick={() => setShowFavoritesOnly((current) => !current)}
              type="button"
              aria-pressed={showFavoritesOnly}
            >
              保存済みのみ
            </button>
          </div>

          <div className="tag-row" aria-label="タグで絞り込み">
            <button
              className={`tag-filter${activeTag === "all" ? " is-active" : ""}`}
              onClick={() => setActiveTag("all")}
              type="button"
            >
              すべて
            </button>
            {availableTags.map((tag) => (
              <button
                className={`tag-filter${activeTag === tag ? " is-active" : ""}`}
                key={tag}
                onClick={() => setActiveTag(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="status-stack" aria-live="polite">
            {isLoading ? <p className="muted">カタログと保存状態を読み込んでいます。</p> : null}
            {catalogError ? <p className="error">一覧を読み込めませんでした。</p> : null}
            {preferenceError ? <p className="error">{preferenceError}</p> : null}
          </div>

          <div className="tool-grid">
            {visibleTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                favorite={Boolean(state[tool.id]?.favorite)}
                onToggleFavorite={() => toggleFavorite(tool.id)}
              />
            ))}
          </div>

          {!isLoading && visibleTools.length === 0 ? (
            <div className="empty-state">
              <h3>一致するツールがありません</h3>
              <p>検索語、タグ、保存済みフィルタを変更してください。</p>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function StatusBlock(props: { label: string; value: string }) {
  return (
    <div className="status-block">
      <span>{props.label}</span>
      <strong>{props.value}</strong>
    </div>
  );
}
