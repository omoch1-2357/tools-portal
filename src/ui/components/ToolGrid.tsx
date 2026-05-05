import { ToolCard } from "../../features/catalog/ToolCard";
import type { ToolCatalogItem, ToolPreference } from "../../features/catalog/types";

type ToolGridProps = {
  tools: ToolCatalogItem[];
  preferences: Record<string, ToolPreference>;
  onToggleFavorite: (toolId: string) => void;
};

export function ToolGrid(props: ToolGridProps) {
  return (
    <div className="tool-grid">
      {props.tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          favorite={Boolean(props.preferences[tool.id]?.favorite)}
          onToggleFavorite={() => props.onToggleFavorite(tool.id)}
        />
      ))}
    </div>
  );
}
