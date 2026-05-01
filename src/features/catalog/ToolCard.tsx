import type { ToolCatalogItem } from "./types";

type ToolCardProps = {
  tool: ToolCatalogItem;
  favorite: boolean;
  onToggleFavorite: () => void;
};

export function ToolCard(props: ToolCardProps) {
  const { tool, favorite, onToggleFavorite } = props;
  const repoUrl = tool.repo.includes("/") ? `https://github.com/${tool.repo}` : null;

  return (
    <article className="tool-card">
      <div className="tool-card__top">
        <div>
          <h3>{tool.name}</h3>
          <p>{tool.description}</p>
        </div>
        <button
          className={`ghost-button${favorite ? " is-active" : ""}`}
          onClick={onToggleFavorite}
          type="button"
        >
          {favorite ? "保存済み" : "保存"}
        </button>
      </div>

      <div className="tool-card__tags">
        {tool.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="tool-card__actions">
        <a className="primary-button" href={tool.url}>
          開く
        </a>
        {repoUrl ? (
          <a className="ghost-button" href={repoUrl} target="_blank" rel="noreferrer">
            Repo
          </a>
        ) : null}
      </div>
    </article>
  );
}
