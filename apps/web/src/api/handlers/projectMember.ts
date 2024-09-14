import { http, HttpResponse } from 'msw';
import {
  addProjectMember,
  getProjectMembers,
  getProjectMemberById,
  updateProjectMember,
  deleteProjectMember,
} from '../services/projectMember';

export const projectMemberHandlers = [
  http.get('/api/project-members', async () => {
    const projectMembers = await getProjectMembers();
    return HttpResponse.json(projectMembers);
  }),
  http.get('/api/project-members/:projectId/:employeeId', async ({ params }) => {
    const { projectId, employeeId } = params;
    const projectMember = await getProjectMemberById(Number(projectId), Number(employeeId));
    return projectMember
      ? HttpResponse.json(projectMember)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post('/api/project-members', async ({ request }) => {
    const newProjectMember:any = await request.json();
    await addProjectMember(newProjectMember);
    return HttpResponse.json(newProjectMember, { status: 201 });
  }),
  http.put('/api/project-members/:projectId/:employeeId', async ({ params, request }) => {
    const { projectId, employeeId } = params;
    const updates:any = await request.json();
    const updatedProjectMember = await updateProjectMember(Number(projectId), Number(employeeId), updates);
    return updatedProjectMember
      ? HttpResponse.json(updatedProjectMember)
      : new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/project-members/:projectId/:employeeId', async ({ params }) => {
    const { projectId, employeeId } = params;
    await deleteProjectMember(Number(projectId), Number(employeeId));
    return new HttpResponse(null, { status: 204 });
  }),
];
