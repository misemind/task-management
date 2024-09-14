import { dbPromise } from '../db';

interface ProjectMember {
  projectId: number;
  employeeId: number;
}

export const addProjectMember = async (projectMember: ProjectMember) => {
  const db = await dbPromise;
  await db.put('projectMembers', projectMember);
};

export const getProjectMembers = async () => {
  const db = await dbPromise;
  return db.getAll('projectMembers');
};

export const getProjectMemberById = async (projectId: number, employeeId: number) => {
  const db = await dbPromise;
  return db.get('projectMembers', [projectId, employeeId]);
};

export const updateProjectMember = async (projectId: number, employeeId: number, updates: Partial<ProjectMember>) => {
  const db = await dbPromise;
  const projectMember = await db.get('projectMembers', [projectId, employeeId]);
  if (projectMember) {
    const updatedProjectMember = { ...projectMember, ...updates };
    await db.put('projectMembers', updatedProjectMember);
    return updatedProjectMember;
  }
  return null;
};

export const deleteProjectMember = async (projectId: number, employeeId: number) => {
  const db = await dbPromise;
  await db.delete('projectMembers', [projectId, employeeId]);
};
