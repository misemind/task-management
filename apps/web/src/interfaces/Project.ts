// Project.ts

import { Employee } from './Employee';

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  lastUpdate: string;
  isDesign1: boolean;
  img: string;
  imgbgColor: string;
  ratingClass:string;
  employees: Employee[];
}
