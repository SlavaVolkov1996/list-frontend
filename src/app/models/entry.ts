export interface Entry {
  id: string;
  title: string;
  entries: Entry[];
  isExpanded?: boolean;
  parent?: Entry;
}

export function createEmptyEntry(title: string = 'Новая запись', parent?: Entry): Entry {
  return {
    id: generateId(),
    title: title,
    entries: [],
    isExpanded: true,
    parent: parent
  };
}

function generateId(): string {
  return 'entry_' + Math.random().toString(36).substr(2, 9);
}

export function removeEntryById(entries: Entry[], id: string): { updatedEntries: Entry[], removed: boolean } {
  let removed = false;
  const updatedEntries = entries.filter(entry => {
    if (entry.id === id) {
      removed = true;
      return false;
    }
    const result = removeEntryById(entry.entries, id);
    entry.entries = result.updatedEntries;
    removed = removed || result.removed;
    return true;
  });
  return { updatedEntries, removed };
}

export function countTotalEntries(entries: Entry[]): number {
  let count = 0;
  for (const entry of entries) {
    count += 1 + countTotalEntries(entry.entries);
  }
  return count;
}

export function getMaxDepth(entries: Entry[]): number {
  if (entries.length === 0) return 0;
  let maxDepth = 0;
  for (const entry of entries) {
    const depth = 1 + getMaxDepth(entry.entries);
    if (depth > maxDepth) maxDepth = depth;
  }
  return maxDepth;
}