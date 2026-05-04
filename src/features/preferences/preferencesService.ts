import {
  collection,
  doc,
  getDocs,
  type QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../../lib/firebase/client";
import { timestampToIso } from "../../lib/firebase/firestoreData";
import type { AuthUser } from "../auth/types";
import type { ToolPreference } from "../catalog/types";

export type PreferenceDocument = {
  id: string;
  data: Record<string, unknown>;
};

export function userAppsCollectionPath(uid: string): [string, string, string] {
  return ["users", uid, "apps"];
}

export function userPreferenceDocumentPath(uid: string, toolId: string) {
  return [...userAppsCollectionPath(uid), toolId] as [string, string, string, string];
}

export function mapPreferenceDocument(document: PreferenceDocument): ToolPreference | null {
  const data = document.data;
  if (typeof data.favorite !== "boolean") {
    return null;
  }

  return {
    favorite: data.favorite === true,
    favoriteUpdatedAt: timestampToIso(data.favoriteUpdatedAt) ?? new Date(0).toISOString(),
  };
}

export function preferenceWriteData(preference: ToolPreference, favoriteUpdatedAt: unknown) {
  return {
    favorite: preference.favorite,
    favoriteUpdatedAt,
  };
}

function mapPreferenceSnapshot(documentSnapshot: QueryDocumentSnapshot): ToolPreference | null {
  return mapPreferenceDocument({
    id: documentSnapshot.id,
    data: documentSnapshot.data(),
  });
}

export async function fetchUserPreferences(user: AuthUser) {
  if (!db) {
    throw new Error("Firestore が利用できません。");
  }

  const snapshot = await getDocs(collection(db, ...userAppsCollectionPath(user.uid)));
  return snapshot.docs.reduce<Record<string, ToolPreference>>((result, documentSnapshot) => {
    const preference = mapPreferenceSnapshot(documentSnapshot);
    if (!preference) {
      return result;
    }

    result[documentSnapshot.id] = preference;
    return result;
  }, {});
}

export async function savePreference(user: AuthUser, toolId: string, preference: ToolPreference) {
  if (!db) {
    throw new Error("Firestore が利用できません。");
  }

  await setDoc(
    doc(db, ...userPreferenceDocumentPath(user.uid, toolId)),
    preferenceWriteData(preference, serverTimestamp()),
    { merge: true },
  );
}

export async function savePreferenceBatch(
  user: AuthUser,
  preferences: Record<string, ToolPreference>,
) {
  const tasks = Object.entries(preferences).map(([toolId, preference]) =>
    savePreference(user, toolId, preference),
  );
  await Promise.all(tasks);
}
