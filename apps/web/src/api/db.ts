import { openDB, DBSchema } from 'idb';
import { employeeData } from './data/employee';
import { portfolioData } from './data/portfolio';
import { skillData } from './data/skill';
import { employeeSkillData } from './data/employeeSkill';
import { projectData } from './data/project';
import { projectMemberData } from './data/projectMember';
import { activityData } from './data/activity';
import { suggestionData } from './data/suggestion';

// Define interfaces for each entity
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  joiningDate: string;
  designation: string;
  profileCompletion: number;
  followers: number;
  following: number;
}
interface Project {
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
    employees: Employee[];
}

interface Portfolio {
  id: number;
  employeeId: number;
  socialMediaType: string;
  url: string;
}

interface Skill {
  id: number;
  name: string;
}

interface EmployeeSkill {
  employeeId: number;
  skillId: number;
}



interface ProjectMember {
  projectId: number;
  employeeId: number;
}

interface Activity {
  id: number;
  employeeId: number;
  description: string;
  date: string;
}

interface Suggestion {
  id: number;
  employeeId: number;
  suggestedEmployeeId: number;
}

// Extend DBSchema to include stores for each entity
interface MyDB extends DBSchema {
  employees: {
    key: number;
    value: Employee;
  };
  portfolios: {
    key: number;
    value: Portfolio;
  };
  skills: {
    key: number;
    value: Skill;
  };
  employeeSkills: {
    key: [number, number]; // Composite key
    value: EmployeeSkill;
  };
  projects: {
    key: number;
    value: Project;
  };
  projectMembers: {
    key: [number, number]; // Composite key
    value: ProjectMember;
  };
  activities: {
    key: number;
    value: Activity;
  };
  suggestions: {
    key: number;
    value: Suggestion;
  };
}

// Open the database with the defined schema and populate with sample data
export const dbPromise = openDB<MyDB>('proactforge', 1, {
  upgrade(db) {
    const employeeStore = db.createObjectStore('employees', { keyPath: 'id' });
    const portfolioStore = db.createObjectStore('portfolios', { keyPath: 'id' });
    const skillStore = db.createObjectStore('skills', { keyPath: 'id' });
    const employeeSkillStore = db.createObjectStore('employeeSkills', { keyPath: ['employeeId', 'skillId'] });
    const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
    const projectMemberStore = db.createObjectStore('projectMembers', { keyPath: ['projectId', 'employeeId'] });
    const activityStore = db.createObjectStore('activities', { keyPath: 'id' });
    const suggestionStore = db.createObjectStore('suggestions', { keyPath: 'id' });

    // Populate stores with sample data
    employeeData.forEach(employee => employeeStore.add(employee));
    portfolioData.forEach(portfolio => portfolioStore.add(portfolio));
    skillData.forEach(skill => skillStore.add(skill));
    employeeSkillData.forEach(employeeSkill => employeeSkillStore.add(employeeSkill));
    projectData.forEach(project => projectStore.add(project));
    projectMemberData.forEach(projectMember => projectMemberStore.add(projectMember));
    activityData.forEach(activity => activityStore.add(activity));
    suggestionData.forEach(suggestion => suggestionStore.add(suggestion));
  },
});
