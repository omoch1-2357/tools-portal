import { collection, getDocs, type QueryDocumentSnapshot } from "firebase/firestore";

import { db } from "../../lib/firebase/client";
import { timestampToIso } from "../../lib/firebase/firestoreData";
import type { ToolCatalogItem } from "./types";

export type FirestoreDocumentData = Record<string, unknown>;

export type FirestoreDocument = {
  id: string;
  data: FirestoreDocumentData;
};

export const toolsCollectionPath = "tools";

export function mapToolDocument(document: FirestoreDocument): ToolCatalogItem {
  const data = document.data;
  return {
    id: document.id,
    name: typeof data.name === "string" ? data.name : document.id,
    description: typeof data.description === "string" ? data.description : "",
    url: typeof data.url === "string" ? data.url : "#",
    repo: typeof data.repo === "string" ? data.repo : document.id,
    tags: Array.isArray(data.tags)
      ? data.tags.filter((value): value is string => typeof value === "string")
      : [],
    visible: data.visible !== false,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 9999,
    updatedAt: timestampToIso(data.updatedAt),
  };
}

function mapToolSnapshot(documentSnapshot: QueryDocumentSnapshot): ToolCatalogItem {
  return mapToolDocument({
    id: documentSnapshot.id,
    data: documentSnapshot.data(),
  });
}

export function sortCatalogTools(tools: ToolCatalogItem[]) {
  return [...tools].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.name.localeCompare(right.name, "ja");
  });
}

export async function fetchCatalogFromFirestore() {
  if (!db) {
    throw new Error("Firebase が設定されていません。");
  }

  const snapshot = await getDocs(collection(db, toolsCollectionPath));
  return sortCatalogTools(snapshot.docs.map(mapToolSnapshot));
}
