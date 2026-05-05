import type { ToolCatalogItem, ToolPreference } from "../../features/catalog/types";
import { EmptyState } from "./EmptyState";
import { SearchControls } from "./SearchControls";
import { TagFilter } from "./TagFilter";
import { ToolGrid } from "./ToolGrid";
import { WorkspaceStatus } from "./WorkspaceStatus";

type CatalogWorkspaceProps = {
  tools: ToolCatalogItem[];
  preferences: Record<string, ToolPreference>;
  availableTags: string[];
  searchText: string;
  activeTag: string;
  showFavoritesOnly: boolean;
  isLoading: boolean;
  catalogError: string | null;
  preferenceError: string | null;
  onSearchTextChange: (value: string) => void;
  onToggleFavoritesOnly: () => void;
  onActiveTagChange: (tag: string) => void;
  onToggleFavorite: (toolId: string) => void;
};

export function CatalogWorkspace(props: CatalogWorkspaceProps) {
  return (
    <section className="workspace" aria-labelledby="tools-heading">
      <div className="workspace-header">
        <div>
          <p className="section-label">Catalog</p>
          <h2 id="tools-heading">ツール一覧</h2>
        </div>
        <div className="result-count" aria-live="polite">
          {props.isLoading ? "読み込み中" : `${props.tools.length} 件`}
        </div>
      </div>

      <SearchControls
        searchText={props.searchText}
        showFavoritesOnly={props.showFavoritesOnly}
        onSearchTextChange={props.onSearchTextChange}
        onToggleFavoritesOnly={props.onToggleFavoritesOnly}
      />

      <TagFilter
        tags={props.availableTags}
        activeTag={props.activeTag}
        onActiveTagChange={props.onActiveTagChange}
      />

      <WorkspaceStatus
        isLoading={props.isLoading}
        catalogError={props.catalogError}
        preferenceError={props.preferenceError}
      />

      <ToolGrid
        tools={props.tools}
        preferences={props.preferences}
        onToggleFavorite={props.onToggleFavorite}
      />

      {!props.isLoading && props.tools.length === 0 ? <EmptyState /> : null}
    </section>
  );
}
