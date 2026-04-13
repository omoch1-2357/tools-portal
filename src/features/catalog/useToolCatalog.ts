import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "../../lib/firebase/client";
import { fetchCatalogFromFirestore } from "./catalogService";
import { sampleTools } from "./sampleTools";
import type { ToolCatalogItem } from "./types";

type CatalogState = {
  tools: ToolCatalogItem[];
  loading: boolean;
  error: string | null;
  source: "firestore" | "sample";
};

export function useToolCatalog(): CatalogState {
  const [tools, setTools] = useState<ToolCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"firestore" | "sample">("sample");

  useEffect(() => {
    let active = true;

    async function load() {
      if (!isFirebaseConfigured) {
        setTools(sampleTools);
        setSource("sample");
        setLoading(false);
        return;
      }

      try {
        const nextTools = await fetchCatalogFromFirestore();
        if (!active) {
          return;
        }

        setTools(nextTools);
        setSource("firestore");
      } catch (error) {
        if (!active) {
          return;
        }

        setTools(sampleTools);
        setSource("sample");
        setError(error instanceof Error ? error.message : "カタログ取得に失敗しました。");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  return { tools, loading, error, source };
}
