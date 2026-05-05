type SearchControlsProps = {
  searchText: string;
  showFavoritesOnly: boolean;
  onSearchTextChange: (value: string) => void;
  onToggleFavoritesOnly: () => void;
};

export function SearchControls(props: SearchControlsProps) {
  return (
    <div className="search-panel">
      <label className="search-field">
        <span className="sr-only">名前、説明、タグで検索</span>
        <input
          value={props.searchText}
          onChange={(event) => props.onSearchTextChange(event.target.value)}
          placeholder="名前、説明、タグで検索"
          type="search"
        />
      </label>
      <button
        className={`filter-toggle${props.showFavoritesOnly ? " is-active" : ""}`}
        onClick={props.onToggleFavoritesOnly}
        type="button"
        aria-pressed={props.showFavoritesOnly}
      >
        保存済みのみ
      </button>
    </div>
  );
}
