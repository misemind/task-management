import { http, HttpResponse } from 'msw';
import {
  addEmployeeSkill,
  getEmployeeSkills,
  getEmployeeSkillById,
  updateEmployeeSkill,
  deleteEmployeeSkill,
} from '../services/employeeSkill';

export const employeeSkillHandlers = [
  http.get('/api/employee-skills', async () => {
    const employeeSkills = await getEmployeeSkills();
    return HttpResponse.json(employeeSkills);
  }),
  http.get('/api/employee-skills/:employeeId/:skillId', async ({ params }) => {
    const { employeeId, skillId } = params;
    const employeeSkill = await getEmployeeSkillById(Number(employeeId), Number(skillId));
    return employeeSkill
      ? HttpResponse.json(employeeSkill)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post('/api/employee-skills', async ({ request }) => {
    const newEmployeeSkill:any = await request.json();
    await addEmployeeSkill(newEmployeeSkill);
    return HttpResponse.json(newEmployeeSkill, { status: 201 });
  }),
  http.put('/api/employee-skills/:employeeId/:skillId', async ({ params, request }) => {
    const { employeeId, skillId } = params;
    const updates:any = await request.json();
    const updatedEmployeeSkill = await updateEmployeeSkill(Number(employeeId), Number(skillId), updates);
    return updatedEmployeeSkill
      ? HttpResponse.json(updatedEmployeeSkill)
      : new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/employee-skills/:employeeId/:skillId', async ({ params }) => {
    const { employeeId, skillId } = params;
    await deleteEmployeeSkill(Number(employeeId), Number(skillId));
    return new HttpResponse(null, { status: 204 });
  }),
];
