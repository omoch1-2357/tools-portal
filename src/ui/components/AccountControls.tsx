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
        <span>認証確認中</span>
      ) : user ? (
        <>
          <span>{userLabel}</span>
          <button className="button button--quiet" onClick={onSignOut} type="button">
            ログアウト
          </button>
        </>
      ) : (
        <>
          <span>未ログイン</span>
          <button
            className="button button--primary"
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
