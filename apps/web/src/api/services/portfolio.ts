import { dbPromise } from '../db';

interface Portfolio {
  id: number;
  employeeId: number;
  socialMediaType: string;
  url: string;
}

export const addPortfolio = async (portfolio: Portfolio) => {
  const db = await dbPromise;
  await db.put('portfolios', portfolio);
};

export const getPortfolios = async () => {
  const db = await dbPromise;
  return db.getAll('portfolios');
};

export const getPortfolioById = async (id: number) => {
  const db = await dbPromise;
  return db.get('portfolios', id);
};

export const updatePortfolio = async (id: number, updates: Partial<Portfolio>) => {
  const db = await dbPromise;
  const portfolio = await db.get('portfolios', id);
  if (portfolio) {
    const updatedPortfolio = { ...portfolio, ...updates };
    await db.put('portfolios', updatedPortfolio);
    return updatedPortfolio;
  }
  return null;
};

export const deletePortfolio = async (id: number) => {
  const db = await dbPromise;
  await db.delete('portfolios', id);
};
