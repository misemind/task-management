import { http, HttpResponse } from 'msw';
import {
  addActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from '../services/activity';

export const activityHandlers = [
  http.get('/api/activities', async () => {
    const activities = await getActivities();
    return HttpResponse.json(activities);
  }),
  http.get('/api/activities/:id', async ({ params }) => {
    const { id } = params;
    const activity = await getActivityById(Number(id));
    return activity
      ? HttpResponse.json(activity)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post('/api/activities', async ({ request }) => {
    const newActivity:any = await request.json();
    await addActivity(newActivity);
    return HttpResponse.json(newActivity, { status: 201 });
  }),
  http.put('/api/activities/:id', async ({ params, request }) => {
    const { id } = params;
    const updates:any = await request.json();
    const updatedActivity = await updateActivity(Number(id), updates);
    return updatedActivity
      ? HttpResponse.json(updatedActivity)
      : new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/activities/:id', async ({ params }) => {
    const { id } = params;
    await deleteActivity(Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
