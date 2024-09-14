import { dbPromise } from '../db';

interface Skill {
  id: number;
  name: string;
}

export const addSkill = async (skill: Skill) => {
  const db = await dbPromise;
  await db.put('skills', skill);
};

export const getSkills = async () => {
  const db = await dbPromise;
  return db.getAll('skills');
};

export const getSkillById = async (id: number) => {
  const db = await dbPromise;
  return db.get('skills', id);
};

export const updateSkill = async (id: number, updates: Partial<Skill>) => {
  const db = await dbPromise;
  const skill = await db.get('skills', id);
  if (skill) {
    const updatedSkill = { ...skill, ...updates };
    await db.put('skills', updatedSkill);
    return updatedSkill;
  }
  return null;
};

export const deleteSkill = async (id: number) => {
  const db = await dbPromise;
  await db.delete('skills', id);
};
