import type { AuthUser } from "../../features/auth/types";
import { AccountControls } from "./AccountControls";

type PortalHeaderProps = {
  user: AuthUser | null;
  authLoading: boolean;
  authEnabled: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function PortalHeader(props: PortalHeaderProps) {
  return (
    <header className="portal-topbar">
      <div>
        <p className="portal-kicker">Tools Portal</p>
        <h1>ツールを探して、保存して、すぐ開く。</h1>
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
