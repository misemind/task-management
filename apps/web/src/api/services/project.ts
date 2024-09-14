import { dbPromise } from '../db';

interface Employee {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    joiningDate: string;
    designation: string;
    profileCompletion: number;
    followers: number;
    following: number;
  }
  interface Project {
      id: number;
      name: string;
      description: string;
      startDate: string;
      endDate: string;
      status: string;
      lastUpdate: string;
      isDesign1: boolean;
      img: string;
      imgbgColor: string;
      employees: Employee[];
  }

export const addProject = async (project: Project) => {
  const db = await dbPromise;
  await db.put('projects', project);
};

export const getProjects = async () => {
  const db = await dbPromise;
  return db.getAll('projects');
};

export const getProjectById = async (id: number) => {
  const db = await dbPromise;
  return db.get('projects', id);
};

export const updateProject = async (id: number, updates: Partial<Project>) => {
  const db = await dbPromise;
  const project = await db.get('projects', id);
  if (project) {
    const updatedProject = { ...project, ...updates };
    await db.put('projects', updatedProject);
    return updatedProject;
  }
  return null;
};

export const deleteProject = async (id: number) => {
  const db = await dbPromise;
  await db.delete('projects', id);
};
