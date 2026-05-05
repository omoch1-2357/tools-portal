import type { AuthUser } from "../../features/auth/types";
import { AccountControls } from "./AccountControls";

type PortalHeaderProps = {
  user: AuthUser | null;
  authLoading: boolean;
  authEnabled: boolean;
  favoriteCount: number;
  visibleToolCount: number;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function PortalHeader(props: PortalHeaderProps) {
  return (
    <header className="portal-topbar">
      <div className="portal-title">
        <p className="portal-kicker">Tools Portal</p>
        <h1>ツールを探して、保存して、すぐ開く。</h1>
        <p className="portal-lead">
          よく使う個人ツールを、検索・タグ・保存済みで軽く絞り込めます。
        </p>
        <div className="portal-quick-stats" aria-label="ポータル概要">
          <span>{props.visibleToolCount} tools</span>
          <span>{props.favoriteCount} saved</span>
        </div>
      </div>
      <AccountControls
        user={props.user}
        authLoading={props.authLoading}
        authEnabled={props.authEnabled}
        onSignIn={props.onSignIn}
        onSignOut={props.onSignOut}
      />
    </header>
  );
}
