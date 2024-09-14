export type Task = {
    title: string;
    completed: boolean;
  };
  
  export type Person = {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    tasks: Task[]; // Added tasks array to represent tasks assigned to the person
  };
  
  export const data: Person[] = [
    {
      firstName: 'Dylan',
      lastName: 'Murray',
      address: '261 Erdman Ford',
      city: 'East Daphne',
      state: 'Kentucky',
      tasks: [
        { title: 'Complete report', completed: true },
        { title: 'Attend meeting', completed: false },
      ],
    },
    {
      firstName: 'Raquel',
      lastName: 'Kohler',
      address: '769 Dominic Grove',
      city: 'Columbus',
      state: 'Ohio',
      tasks: [
        { title: 'Finish design mockup', completed: false },
        { title: 'Email client feedback', completed: true },
      ],
    },
    {
      firstName: 'Ervin',
      lastName: 'Reinger',
      address: '566 Brakus Inlet',
      city: 'South Linda',
      state: 'West Virginia',
      tasks: [
        { title: 'Fix website bugs', completed: true },
        { title: 'Write unit tests', completed: false },
      ],
    },
    {
      firstName: 'Brittany',
      lastName: 'McCullough',
      address: '722 Emie Stream',
      city: 'Lincoln',
      state: 'Nebraska',
      tasks: [
        { title: 'Create project plan', completed: true },
        { title: 'Team meeting', completed: false },
      ],
    },
    {
      firstName: 'Branson',
      lastName: 'Frami',
      address: '32188 Larkin Turnpike',
      city: 'Charleston',
      state: 'South Carolina',
      tasks: [
        { title: 'Deploy new release', completed: false },
        { title: 'Prepare for presentation', completed: true },
      ],
    },
    {
      firstName: 'Dylan',
      lastName: 'Murray',
      address: '261 Erdman Ford',
      city: 'East Daphne',
      state: 'Kentucky',
      tasks: [
        { title: 'Prepare documentation', completed: true },
        { title: 'Schedule client call', completed: false },
      ],
    },
    {
      firstName: 'Raquel',
      lastName: 'Kohler',
      address: '769 Dominic Grove',
      city: 'Columbus',
      state: 'Ohio',
      tasks: [
        { title: 'Review project progress', completed: true },
        { title: 'Update task board', completed: false },
      ],
    },
    {
      firstName: 'Ervin',
      lastName: 'Reinger',
      address: '566 Brakus Inlet',
      city: 'South Linda',
      state: 'West Virginia',
      tasks: [
        { title: 'Prepare deployment', completed: false },
        { title: 'Fix critical bug', completed: true },
      ],
    },
    {
      firstName: 'Brittany',
      lastName: 'McCullough',
      address: '722 Emie Stream',
      city: 'Lincoln',
      state: 'Nebraska',
      tasks: [
        { title: 'Design system architecture', completed: false },
        { title: 'Coordinate with dev team', completed: true },
      ],
    },
    {
      firstName: 'Branson',
      lastName: 'Frami',
      address: '32188 Larkin Turnpike',
      city: 'Charleston',
      state: 'South Carolina',
      tasks: [
        { title: 'Submit project report', completed: true },
        { title: 'Set up server', completed: false },
      ],
    },
  ];
  