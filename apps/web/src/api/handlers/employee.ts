import { http, HttpResponse } from 'msw';
import {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../services/employee';

export const employeeHandlers = [
  http.get('/api/employees', async () => {
    const employees = await getEmployees();
    return HttpResponse.json(employees);
  }),
  http.get('/api/employees/:id', async ({ params }) => {
    const { id } = params;
    const employee = await getEmployeeById(Number(id));
    return employee
      ? HttpResponse.json(employee)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post('/api/employees', async ({ request }) => {
    const newEmployee:any = await request.json();
    await addEmployee(newEmployee);
    return HttpResponse.json(newEmployee, { status: 201 });
  }),
  http.put('/api/employees/:id', async ({ params, request }) => {
    const { id } = params;
    const updates:any = await request.json();
    const updatedEmployee = await updateEmployee(Number(id), updates);
    return updatedEmployee
      ? HttpResponse.json(updatedEmployee)
      : new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/employees/:id', async ({ params }) => {
    const { id } = params;
    await deleteEmployee(Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
