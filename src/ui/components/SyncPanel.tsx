type SyncPanelProps = {
  signedIn: boolean;
  authEnabled: boolean;
  hasLocalData: boolean;
  lastSavedLabel: string | null;
  onSyncLocalToCloud: () => void;
};

export function SyncPanel(props: SyncPanelProps) {
  return (
    <section className="sync-panel">
      <div>
        <h2>保存状態</h2>
        <p>
          {props.signedIn
            ? "お気に入りはクラウドに保存されます。"
            : "ログインなしでも、この端末に保存できます。"}
        </p>
        {props.lastSavedLabel ? (
          <p className="save-time">最終保存: {props.lastSavedLabel}</p>
        ) : null}
      </div>

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
