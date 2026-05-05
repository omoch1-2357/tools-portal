type SidebarStatusProps = {
  visibleToolCount: number;
  favoriteCount: number;
  catalogLabel: string;
  storageLabel: string;
};

export function SidebarStatus(props: SidebarStatusProps) {
  return (
    <section className="summary-panel">
      <div className="panel-heading">
        <span className="section-label">Status</span>
        <h2>現在の状態</h2>
      </div>
      <div className="metric-list">
        <StatusBlock label="表示ツール" value={String(props.visibleToolCount)} />
        <StatusBlock label="保存済み" value={String(props.favoriteCount)} />
        <StatusBlock label="カタログ" value={props.catalogLabel} />
        <StatusBlock label="保存先" value={props.storageLabel} />
      </div>
    </section>
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
