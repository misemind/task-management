import { dbPromise } from '../db';

interface EmployeeSkill {
  employeeId: number;
  skillId: number;
}

export const addEmployeeSkill = async (employeeSkill: EmployeeSkill) => {
  const db = await dbPromise;
  await db.put('employeeSkills', employeeSkill);
};

export const getEmployeeSkills = async () => {
  const db = await dbPromise;
  return db.getAll('employeeSkills');
};

export const getEmployeeSkillById = async (employeeId: number, skillId: number) => {
  const db = await dbPromise;
  return db.get('employeeSkills', [employeeId, skillId]);
};

export const updateEmployeeSkill = async (employeeId: number, skillId: number, updates: Partial<EmployeeSkill>) => {
  const db = await dbPromise;
  const employeeSkill = await db.get('employeeSkills', [employeeId, skillId]);
  if (employeeSkill) {
    const updatedEmployeeSkill = { ...employeeSkill, ...updates };
    await db.put('employeeSkills', updatedEmployeeSkill);
    return updatedEmployeeSkill;
  }
  return null;
};

export const deleteEmployeeSkill = async (employeeId: number, skillId: number) => {
  const db = await dbPromise;
  await db.delete('employeeSkills', [employeeId, skillId]);
};
