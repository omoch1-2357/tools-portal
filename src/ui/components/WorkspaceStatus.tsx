type WorkspaceStatusProps = {
  isLoading: boolean;
  catalogError: string | null;
  preferenceError: string | null;
};

export function WorkspaceStatus(props: WorkspaceStatusProps) {
  return (
    <div className="status-stack" aria-live="polite">
      {props.isLoading ? <p className="muted">カタログと保存状態を読み込んでいます。</p> : null}
      {props.catalogError ? <p className="error">一覧を読み込めませんでした。</p> : null}
      {props.preferenceError ? <p className="error">{props.preferenceError}</p> : null}
    </div>
  );
}
