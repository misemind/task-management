import { dbPromise } from '../db';

interface Activity {
  id: number;
  employeeId: number;
  description: string;
  date: string;
}

export const addActivity = async (activity: Activity) => {
  const db = await dbPromise;
  await db.put('activities', activity);
};

export const getActivities = async () => {
  const db = await dbPromise;
  return db.getAll('activities');
};

export const getActivityById = async (id: number) => {
  const db = await dbPromise;
  return db.get('activities', id);
};

export const updateActivity = async (id: number, updates: Partial<Activity>) => {
  const db = await dbPromise;
  const activity = await db.get('activities', id);
  if (activity) {
    const updatedActivity = { ...activity, ...updates };
    await db.put('activities', updatedActivity);
    return updatedActivity;
  }
  return null;
};

export const deleteActivity = async (id: number) => {
  const db = await dbPromise;
  await db.delete('activities', id);
};
