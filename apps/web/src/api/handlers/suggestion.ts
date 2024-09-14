import { http, HttpResponse } from 'msw';
import {
  addSuggestion,
  getSuggestions,
  getSuggestionById,
  updateSuggestion,
  deleteSuggestion,
} from '../services/suggestion';

export const suggestionHandlers = [
  http.get('/api/suggestions', async () => {
    const suggestions = await getSuggestions();
    return HttpResponse.json(suggestions);
  }),
  http.get('/api/suggestions/:id', async ({ params }) => {
    const { id } = params;
    const suggestion = await getSuggestionById(Number(id));
    return suggestion
      ? HttpResponse.json(suggestion)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post('/api/suggestions', async ({ request }) => {
    const newSuggestion:any = await request.json();
    await addSuggestion(newSuggestion);
    return HttpResponse.json(newSuggestion, { status: 201 });
  }),
  http.put('/api/suggestions/:id', async ({ params, request }) => {
    const { id } = params;
    const updates:any = await request.json();
    const updatedSuggestion = await updateSuggestion(Number(id), updates);
    return updatedSuggestion
      ? HttpResponse.json(updatedSuggestion)
      : new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/suggestions/:id', async ({ params }) => {
    const { id } = params;
    await deleteSuggestion(Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
