import { http, HttpResponse } from 'msw';
import {
  addSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from '../services/skill';

export const skillHandlers = [
  http.get('/api/skills', async () => {
    const skills = await getSkills();
    return HttpResponse.json(skills);
  }),
  http.get('/api/skills/:id', async ({ params }) => {
    const { id } = params;
    const skill = await getSkillById(Number(id));
    return skill
      ? HttpResponse.json(skill)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post('/api/skills', async ({ request }) => {
    const newSkill:any = await request.json();
    await addSkill(newSkill);
    return HttpResponse.json(newSkill, { status: 201 });
  }),
  http.put('/api/skills/:id', async ({ params, request }) => {
    const { id } = params;
    const updates:any= await request.json();
    const updatedSkill = await updateSkill(Number(id), updates);
    return updatedSkill
      ? HttpResponse.json(updatedSkill)
      : new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/skills/:id', async ({ params }) => {
    const { id } = params;
    await deleteSkill(Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
