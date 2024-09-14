import { http, HttpResponse } from 'msw';
import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../services/project';

export const projectHandlers = [
  http.get('/api/projects', async () => {
    const projects = await getProjects();
    return HttpResponse.json(projects);
  }),
  http.get('/api/projects/:id', async ({ params }) => {
    const { id } = params;
    const project = await getProjectById(Number(id));
    return project
      ? HttpResponse.json(project)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post('/api/projects', async ({ request }) => {
    const newProject:any = await request.json();
    await addProject(newProject);
    return HttpResponse.json(newProject, { status: 201 });
  }),
  http.put('/api/projects/:id', async ({ params, request }) => {
    const { id } = params;
    const updates:any = await request.json();
    const updatedProject = await updateProject(Number(id), updates);
    return updatedProject
      ? HttpResponse.json(updatedProject)
      : new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/projects/:id', async ({ params }) => {
    const { id } = params;
    await deleteProject(Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
