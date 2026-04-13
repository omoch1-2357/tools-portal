import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../../lib/firebase/client";
import type { ToolPreference } from "../catalog/types";

function mapPreference(documentSnapshot: QueryDocumentSnapshot): ToolPreference {
  const data = documentSnapshot.data();

  return {
    favorite: data.favorite === true,
    updatedAt:
      typeof data.updatedAt?.toDate === "function"
        ? data.updatedAt.toDate().toISOString()
        : new Date().toISOString(),
  };
}

export async function fetchUserPreferences(user: User) {
  if (!db) {
    throw new Error("Firestore が利用できません。");
  }

  const snapshot = await getDocs(collection(db, "users", user.uid, "apps"));
  return snapshot.docs.reduce<Record<string, ToolPreference>>((result, documentSnapshot) => {
    result[documentSnapshot.id] = mapPreference(documentSnapshot);
    return result;
  }, {});
}

export async function savePreference(user: User, toolId: string, preference: ToolPreference) {
  if (!db) {
    throw new Error("Firestore が利用できません。");
  }

  await setDoc(
    doc(db, "users", user.uid, "apps", toolId),
    {
      favorite: preference.favorite,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function savePreferenceBatch(user: User, preferences: Record<string, ToolPreference>) {
  const tasks = Object.entries(preferences).map(([toolId, preference]) =>
    savePreference(user, toolId, preference),
  );
  await Promise.all(tasks);
}
