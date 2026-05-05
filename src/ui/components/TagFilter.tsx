import { ALL_TAG_FILTER } from "../../features/catalog/filterTools";

type TagFilterProps = {
  tags: string[];
  activeTag: string;
  onActiveTagChange: (tag: string) => void;
};

export function TagFilter(props: TagFilterProps) {
  return (
    <div className="tag-filter-panel">
      <span className="filter-label">タグ</span>
      <div className="tag-row" aria-label="タグで絞り込み">
        <button
          className={`tag-filter${props.activeTag === ALL_TAG_FILTER ? " is-active" : ""}`}
          onClick={() => props.onActiveTagChange(ALL_TAG_FILTER)}
          type="button"
        >
          すべて
        </button>
        {props.tags.map((tag) => (
          <button
            className={`tag-filter${props.activeTag === tag ? " is-active" : ""}`}
            key={tag}
            onClick={() => props.onActiveTagChange(tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
