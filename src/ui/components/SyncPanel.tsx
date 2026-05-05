type SyncPanelProps = {
  signedIn: boolean;
  authEnabled: boolean;
  hasLocalData: boolean;
  lastSavedLabel: string | null;
  onSyncLocalToCloud: () => void;
};

export function SyncPanel(props: SyncPanelProps) {
  const modeLabel = props.signedIn ? "Cloud sync" : "Local only";

  return (
    <section className="sync-panel">
      <div className="panel-heading">
        <span className="section-label">Sync</span>
        <h2>保存状態</h2>
      </div>
      <div className={`sync-mode${props.signedIn ? " is-cloud" : " is-local"}`}>
        <span>{modeLabel}</span>
        <strong>
          {props.signedIn ? "お気に入りはクラウドに保存されます。" : "この端末に保存されています。"}
        </strong>
      </div>

      {props.lastSavedLabel ? <p className="save-time">最終保存: {props.lastSavedLabel}</p> : null}

      {props.signedIn ? (
        <button
          className="button button--primary"
          onClick={props.onSyncLocalToCloud}
          disabled={!props.hasLocalData}
          type="button"
        >
          ローカル保存を同期
        </button>
      ) : (
        <p className="inline-notice">端末間で同期する場合は GitHub ログインを使います。</p>
      )}
      {!props.authEnabled ? (
        <p className="inline-warning">Firebase 設定未投入のため認証は無効です。</p>
      ) : null}
    </section>
  );
}
