import { http, HttpResponse } from 'msw';
import {
  addPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from '../services/portfolio';

export const portfolioHandlers = [
  http.get('/api/portfolios', async () => {
    const portfolios = await getPortfolios();
    return HttpResponse.json(portfolios);
  }),
  http.get('/api/portfolios/:id', async ({ params }) => {
    const { id } = params;
    const portfolio = await getPortfolioById(Number(id));
    return portfolio
      ? HttpResponse.json(portfolio)
      : new HttpResponse(null, { status: 404 });
  }),
  http.post('/api/portfolios', async ({ request }) => {
    const newPortfolio :any= await request.json();
    await addPortfolio(newPortfolio);
    return HttpResponse.json(newPortfolio, { status: 201 });
  }),
  http.put('/api/portfolios/:id', async ({ params, request }) => {
    const { id } = params;
    const updates:any = await request.json();
    const updatedPortfolio = await updatePortfolio(Number(id), updates);
    return updatedPortfolio
      ? HttpResponse.json(updatedPortfolio)
      : new HttpResponse(null, { status: 404 });
  }),
  http.delete('/api/portfolios/:id', async ({ params }) => {
    const { id } = params;
    await deletePortfolio(Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
