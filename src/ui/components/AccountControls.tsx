import type { AuthUser } from "../../features/auth/types";

type AccountControlsProps = {
  user: AuthUser | null;
  authLoading: boolean;
  authEnabled: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function AccountControls(props: AccountControlsProps) {
  const { user, authLoading, authEnabled, onSignIn, onSignOut } = props;
  const userLabel = user?.displayName ?? user?.email ?? "Signed in";

  return (
    <div className="portal-account" aria-live="polite">
      {authLoading ? (
        <div className="account-summary">
          <span className="account-label">認証確認中</span>
          <span className="account-note">保存先を確認しています</span>
        </div>
      ) : user ? (
        <>
          <div className="account-summary">
            <span className="account-label">{userLabel}</span>
            <span className="account-note">Cloud sync 有効</span>
          </div>
          <button className="button button--quiet account-action" onClick={onSignOut} type="button">
            ログアウト
          </button>
        </>
      ) : (
        <>
          <div className="account-summary">
            <span className="account-label">未ログイン</span>
            <span className="account-note">Local only</span>
          </div>
          <button
            className="button button--primary account-action"
            onClick={onSignIn}
            disabled={!authEnabled}
            type="button"
          >
            GitHub ログイン
          </button>
        </>
      )}
    </div>
  );
}
