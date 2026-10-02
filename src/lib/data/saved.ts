import { DB } from "@/lib/mock-data";
import { makeId } from "@/lib/mock-data/rng";

export function getSavedSpaces(userId: string) {
  const savedIds = new Set(DB.savedSpaces.filter((s) => s.userId === userId).map((s) => s.spaceId));
  return DB.spaces.filter((s) => savedIds.has(s.id));
}

export function isSaved(userId: string, spaceId: string) {
  return DB.savedSpaces.some((s) => s.userId === userId && s.spaceId === spaceId);
}

export function toggleSaved(userId: string, spaceId: string): boolean {
  const existing = DB.savedSpaces.find((s) => s.userId === userId && s.spaceId === spaceId);
  if (existing) {
    DB.savedSpaces = DB.savedSpaces.filter((s) => s !== existing);
    return false;
  }
  DB.savedSpaces.push({ id: makeId("saved"), userId, spaceId, createdAt: new Date().toISOString() });
  return true;
}
