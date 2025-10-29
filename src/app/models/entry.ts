export interface Entry {
  id: string;           // Уникальный идентификатор для управления
  title: string;        // Название записи
  entries: Entry[];     // Вложенные записи (рекурсивная структура)
  isExpanded?: boolean; // Состояние раскрытия для UI
}

// Функция для создания новой записи с уникальным ID
export function createEmptyEntry(title: string = 'Новая запись'): Entry {
  return {
    id: generateId(),
    title: title,
    entries: [],
    isExpanded: true
  };
}

// Генератор уникальных ID
function generateId(): string {
  return 'entry_' + Math.random().toString(36).substr(2, 9);
}

// Рекурсивный поиск записи по ID
export function findEntryById(entries: Entry[], id: string): Entry | null {
  for (const entry of entries) {
    if (entry.id === id) {
      return entry;
    }
    const found = findEntryById(entry.entries, id);
    if (found) return found;
  }
  return null;
}

// Рекурсивное удаление записи по ID
export function removeEntryById(entries: Entry[], id: string): Entry[] {
  return entries.filter(entry => {
    if (entry.id === id) {
      return false;
    }
    entry.entries = removeEntryById(entry.entries, id);
    return true;
  });
}

// Подсчет общей глубины вложенности
export function getMaxDepth(entries: Entry[]): number {
  if (entries.length === 0) return 0;

  let maxDepth = 0;
  for (const entry of entries) {
    const depth = 1 + getMaxDepth(entry.entries);
    if (depth > maxDepth) maxDepth = depth;
  }
  return maxDepth;
}