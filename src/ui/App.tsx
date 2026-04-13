import { useMemo, useState } from "react";
import { useAuthState } from "../features/auth/useAuthState";
import { signInWithGitHub, signOutUser } from "../features/auth/authClient";
import { useToolCatalog } from "../features/catalog/useToolCatalog";
import { ToolCard } from "../features/catalog/ToolCard";
import { useToolPreferences } from "../features/preferences/useToolPreferences";

export function App() {
  const { user, loading: authLoading, authEnabled } = useAuthState();
  const { tools, loading: catalogLoading, error: catalogError, source } = useToolCatalog();
  const [searchText, setSearchText] = useState("");
  const {
    state,
    loading: preferenceLoading,
    error: preferenceError,
    toggleFavorite,
    syncLocalToCloud,
    hasLocalData,
    lastSavedLabel,
  } = useToolPreferences(user, authEnabled);

  const visibleTools = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return tools.filter((tool) => {
      if (!tool.visible) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        tool.name,
        tool.description,
        tool.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [searchText, tools]);

  const favoriteCount = Object.values(state).filter((entry) => entry.favorite).length;

  return (
    <div className="shell">
      <header className="hero">
        <div className="hero__copy">
          <p className="eyebrow">TOOLS PORTAL</p>
          <h1>必要なときにすぐ開ける、個人向けツール集</h1>
          <p className="hero__body">
            よく使うツールをまとめて一覧できるポータルです。気になるものは保存してあとで見返せます。
          </p>
        </div>
        <div className="hero__panel">
          <div className="status-grid">
            <StatusBlock label="カタログ" value={source === "firestore" ? "Firestore" : "Sample"} />
            <StatusBlock label="お気に入り" value={String(favoriteCount)} />
            <StatusBlock
              label="保存先"
              value={user ? "Cloud" : "Local"}
            />
          </div>
          <div className="auth-box">
            {authLoading ? (
              <p className="muted">認証状態を確認中です。</p>
            ) : user ? (
              <>
                <p className="auth-box__title">{user.displayName ?? user.email ?? "ログイン済み"}</p>
                <p className="muted">
                  変更は Firestore に保存されます。{lastSavedLabel ? `最終保存: ${lastSavedLabel}` : ""}
                </p>
                <button className="secondary-button" onClick={signOutUser}>
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <p className="auth-box__title">未ログインでも閲覧とローカル保存は可能です。</p>
                <p className="muted">
                  端末をまたいで同期したい場合のみログインします。
                </p>
                <button
                  className="primary-button"
                  onClick={signInWithGitHub}
                  disabled={!authEnabled}
                >
                  GitHub でログイン
                </button>
                {!authEnabled ? <p className="notice">Firebase 設定未投入のため認証は無効です。</p> : null}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="content">
        <section className="panel">
          <div className="panel__head">
            <div>
              <h2>ツール一覧</h2>
              <p className="muted">
                使いたいツールを選んで開けます。
              </p>
            </div>
            <label className="search">
              <span className="sr-only">検索</span>
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="名前・説明・タグで検索"
              />
            </label>
          </div>

          {catalogLoading || preferenceLoading ? <p className="muted">読み込み中です。</p> : null}
          {catalogError ? <p className="error">一覧を読み込めなかったため、サンプル表示に切り替えています。</p> : null}
          {preferenceError ? <p className="error">{preferenceError}</p> : null}

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

          {!catalogLoading && visibleTools.length === 0 ? (
            <p className="muted">一致するツールがありません。</p>
          ) : null}
        </section>

        <section className="panel sync-panel">
          <div>
            <h2>保存</h2>
            <p className="muted">
              未ログインでも使えます。同期したいときだけログインしてください。
            </p>
          </div>
          {user ? (
            <button className="primary-button" onClick={syncLocalToCloud} disabled={!hasLocalData}>
              ローカル保存をクラウドに反映
            </button>
          ) : (
            <p className="notice">
              いまの状態はこの端末に保存されています。同期したいときだけログインします。
            </p>
          )}
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
