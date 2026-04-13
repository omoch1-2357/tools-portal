export type ToolCatalogItem = {
  id: string;
  name: string;
  description: string;
  url: string;
  repo: string;
  tags: string[];
  visible: boolean;
  sortOrder: number;
  updatedAt?: string;
};

export type ToolPreference = {
  favorite: boolean;
  updatedAt: string;
};
