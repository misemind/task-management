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

export const addEmployee = async (employee: Employee) => {
  const db = await dbPromise;
  await db.put('employees', employee);
};

export const getEmployees = async () => {
  const db = await dbPromise;
  return db.getAll('employees');
};

export const getEmployeeById = async (id: number) => {
  const db = await dbPromise;
  return db.get('employees', id);
};

export const updateEmployee = async (id: number, updates: Partial<Employee>) => {
  const db = await dbPromise;
  const employee = await db.get('employees', id);
  if (employee) {
    const updatedEmployee = { ...employee, ...updates };
    await db.put('employees', updatedEmployee);
    return updatedEmployee;
  }
  return null;
};

export const deleteEmployee = async (id: number) => {
  const db = await dbPromise;
  await db.delete('employees', id);
};
