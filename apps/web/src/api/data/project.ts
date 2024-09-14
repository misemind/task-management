// Import Images
import slack from "../../assets/images/brands/slack.png";
import dribbble from "../../assets/images/brands/dribbble.png";
import mailChimp from "../../assets/images/brands/mail_chimp.png";
import dropbox from "../../assets/images/brands/dropbox.png";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar9 from "../../assets/images/users/avatar-9.jpg";
import avatar10 from "../../assets/images/users/avatar-10.jpg";
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
    taskCount:string;
    backgroundImg:string
    image:string;
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
    isDesign2: boolean;
    isDesign3: boolean;
    priority:string;
    img: string;
    imgbgColor: string;
    employees: Employee[];
  }

export const employeeData = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        location: "New York",
        joiningDate: "2020-01-01",
        designation: "Software Engineer",
        profileCompletion: 80,
        taskCount:'245',
        backgroundImg:'string',
        image:avatar2,
        followers: 100,
        following: 50,
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "098-765-4321",
        location: "San Francisco",
        joiningDate: "2019-05-15",
        designation: "Project Manager",
        profileCompletion: 90,
        taskCount:'245',
        backgroundImg:'string',
        image:avatar3,
        followers: 200,
        following: 150,
    },
];

export const projectData: Project[] = [
    {
        id: 1,
        name: "Project Alpha",
        description: "An innovative project to develop new technology.",
        startDate: "2021-01-01",
        endDate: "2021-12-31",
        status: "Ongoing",
        lastUpdate: "2021-06-01",
        priority: "High",
        isDesign1: true,
        isDesign2: false,
        isDesign3: false,
        img: slack,
        imgbgColor: "warning",
        employees: [employeeData[0], employeeData[1]],
    },
    {
        id: 2,
        name: "Project Beta",
        description: "A project to improve existing infrastructure.",
        startDate: "2020-06-01",
        endDate: "2021-06-01",
        status: "Completed",
        lastUpdate: "2021-06-01",
        priority: "High",
        isDesign1: true,
        isDesign2: false,
        isDesign3: false,
        img: dribbble,
        imgbgColor: "danger",
        employees: [employeeData[0], employeeData[1]],
    },
    {
        id: 3,
        name: "Project Gamma",
        description: "A project to develop a chat application.",
        startDate: "2021-02-01",
        endDate: "2021-12-31",
        status: "Ongoing",
        lastUpdate: "2021-07-01",
        priority: "High",
        isDesign1: true,
        isDesign2: false,
        isDesign3: false,
        img: mailChimp,
        imgbgColor: "success",
        employees: [employeeData[0], employeeData[1]],
    },
    {
        id: 4,
        name: "Project Delta",
        description: "A project for project management application.",
        startDate: "2021-06-01",
        endDate: "2021-12-31",
        status: "Ongoing",
        lastUpdate: "2021-06-21",
        priority: "High",
        isDesign1: true,
        isDesign2: false,
        isDesign3: false,
        img: dropbox,
        imgbgColor: "info",
        employees: [employeeData[0], employeeData[1]],
    },
];
