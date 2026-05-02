import type { ToolCatalogItem } from "./types";

type ToolCardProps = {
  tool: ToolCatalogItem;
  favorite: boolean;
  onToggleFavorite: () => void;
};

export function ToolCard(props: ToolCardProps) {
  const { tool, favorite, onToggleFavorite } = props;
  const repoUrl = tool.repo.includes("/") ? `https://github.com/${tool.repo}` : null;
  const updatedLabel = tool.updatedAt
    ? new Date(tool.updatedAt).toLocaleDateString("ja-JP")
    : null;

  return (
    <article className="tool-card">
      <div className="tool-card__body">
        <div>
          <div className="tool-card__header">
            <h3>{tool.name}</h3>
            {updatedLabel ? <span className="tool-card__date">{updatedLabel}</span> : null}
          </div>
          <p className="tool-card__description">{tool.description}</p>
        </div>

        <div className="tool-card__tags">
          {tool.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="tool-card__actions">
        <a className="button button--primary" href={tool.url}>
          開く
        </a>
        {repoUrl ? (
          <a className="button button--quiet" href={repoUrl} target="_blank" rel="noreferrer">
            Repo
          </a>
        ) : null}
        <button
          className={`save-button${favorite ? " is-active" : ""}`}
          onClick={onToggleFavorite}
          type="button"
          aria-pressed={favorite}
        >
          {favorite ? "保存済み" : "保存"}
        </button>
      </div>
    </article>
  );
}
