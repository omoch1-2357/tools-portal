import {
  collection,
  getDocs,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase/client";
import type { ToolCatalogItem } from "./types";

function mapTool(documentSnapshot: QueryDocumentSnapshot): ToolCatalogItem {
  const data = documentSnapshot.data();

  return {
    id: documentSnapshot.id,
    name: typeof data.name === "string" ? data.name : documentSnapshot.id,
    description: typeof data.description === "string" ? data.description : "",
    url: typeof data.url === "string" ? data.url : "#",
    repo: typeof data.repo === "string" ? data.repo : documentSnapshot.id,
    tags: Array.isArray(data.tags) ? data.tags.filter((value): value is string => typeof value === "string") : [],
    visible: data.visible !== false,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 9999,
    updatedAt: typeof data.updatedAt?.toDate === "function" ? data.updatedAt.toDate().toISOString() : undefined,
  };
}

export async function fetchCatalogFromFirestore() {
  if (!db) {
    throw new Error("Firebase が設定されていません。");
  }

  const snapshot = await getDocs(collection(db, "tools"));
  return snapshot.docs
    .map(mapTool)
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.name.localeCompare(right.name, "ja");
    });
}
