import { dbPromise } from '../db';

interface Suggestion {
  id: number;
  employeeId: number;
  suggestedEmployeeId: number;
}

export const addSuggestion = async (suggestion: Suggestion) => {
  const db = await dbPromise;
  await db.put('suggestions', suggestion);
};

export const getSuggestions = async () => {
  const db = await dbPromise;
  return db.getAll('suggestions');
};

export const getSuggestionById = async (id: number) => {
  const db = await dbPromise;
  return db.get('suggestions', id);
};

export const updateSuggestion = async (id: number, updates: Partial<Suggestion>) => {
  const db = await dbPromise;
  const suggestion = await db.get('suggestions', id);
  if (suggestion) {
    const updatedSuggestion = { ...suggestion, ...updates };
    await db.put('suggestions', updatedSuggestion);
    return updatedSuggestion;
  }
  return null;
};

export const deleteSuggestion = async (id: number) => {
  const db = await dbPromise;
  await db.delete('suggestions', id);
};
