import { request } from './config';

export interface Prize {
  id: number;
  name: string;
  pointsRequired: number;
  description: string;
}

export interface PrizeInput {
  name: string;
  pointsRequired: number;
  description: string;
}

export async function getPrizes(): Promise<Prize[]> {
  return await request<Prize[]>('/prize', 'GET');
}

export async function createPrize(data: PrizeInput): Promise<Prize> {
  return await request<Prize>('/prize', 'POST', data);
}
