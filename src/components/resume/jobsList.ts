import { ReactNode } from "react";

export type JobsType = {
  dates: string;
  role: string;
  company: string;
  companyLink?: string;
  description: ReactNode;
  details: string[];
  tags: string[];
  // projects?: ProjectsType[];
};

const jobsList: JobsType[] = [
  {
    dates: "Jun, 2024 – Present",
    role: "Senior Product Designer",
    company: "Zing Coach",
    companyLink: "https://www.zing.coach",
    description: `Working on one of the <a href="https://www.techradar.com/health-fitness/best-fitness-app" target="_blank">top-rated</a> fitness apps, available on iOS and Android.
Working across mobile features like interactive workouts, body scan, and strength score — combining design, user feedback, and AI-powered technologies to support long-term training at home.`,
    tags: [
      "Web",
      "Mobile",
      "Design system",
      "User Research",
      "Analytics",
      "UI",
    ],
    details: [],
  },
  {
    dates: "Mar, 2021 – Jun, 2024",
    role: "Senior Product Designer",
    company: "StarOfService",
    companyLink: "https://www.starofservice.com/",
    description: `Involved in transitioning a professional services marketplace with a 12 million monthly audience to a new business model. Alongside working on transition projects and design system rebuild, I was responsible for the growth track.`,
    tags: [
      "Web",
      "Mobile",
      "Design system",
      "User Research",
      "Analytics",
      "UI",
    ],
    details: [
      `Growth Track activities included identifying opportunities, conducting user research and AB tests, implementing in code (Next.js, TypeScript, Tailwind CSS), and optimising feature introduction with direct ownership of product metrics.`,
      `I've been working on business model transition projects, introducing and testing new models across various locations.`,
      `Contributed to a 90% design system adoption rate, enhancing platform consistency and accelerating development speed.`,
      `Facilitated ideation workshops and knowledge-sharing sessions, fostering cross-functional collaboration and driving user-centric feature implementation.`,
    ],
  },
  {
    dates: "Feb, 2019 – Jan, 2021",
    role: "Product Designer",
    company: "Valvespace",
    companyLink: "https://www.valvespace.com/",
    description: `Designed a web platform connecting flexible workplace supply and demand, starting from closed beta to 1.0 release. It resulted in acquiring initial client companies, expanding into new markets, and addressing diverse business needs.`,
    details: [
      `As a design team of one, I handled a diverse range of design activities, encompassing both UX and UI design, as well as the creation of a comprehensive design system.`,
      `Contributed directly to our NextJS codebase, that helped to reduce implementation steps and ensure visual quality.`,
    ],
    tags: ["Design system", "User Research", "Web", "UI"],
  },
  {
    dates: "Mar, 2018 – Jul, 2019",
    role: "Senior Experience Designer",
    company: "EPAM Systems",
    companyLink: "https://www.epam.com/",
    description: `Engaged in the end-to-end design process for web and mobile applications, encompassing research, on-site client collaboration, and design leadership. Also involved in conducting UX reviews, providing design mentorship, and unexpectedly a lot of video editing.`,
    details: [
      `My primary role was starting new clients or projects, researching, building trust and future design strategy, working on MVPs with UI designers.`,
      `I participated in projects spanning diverse domains, including online marketplaces, shipping and logistics, augmented reality, construction and architecture, and energy and utilities.`,
      `Besides the main projects, I was involved in a wide range of other design activities, ex. UX audits, curating pitches and creating video presentations, helping with research and POC, etc.`,
      `Mentoring other designers and participating in EPAM educating initiatives.`,
    ],
    tags: ["Design system", "User Research", "Analytics", "Web", "Mobile"],
  },
  {
    dates: "Feb, 2017 – Mar, 2018",
    role: "UX/UI Designer",
    company: "Zensoft",
    description: `I was creating designs for desktop and mobile applications helping startups establish on the market. Later, I was leading design teams and ran projects in close collaboration with clients and developers.`,
    details: [
      `Each project typically involved the development of MVPs and product videos. I've worked across various domains, including Healthcare, Finance, Issue tracking, and Smart assistant.`,
      `Initially collaborated in a team alongside a Lead designer; transitioned to leading design projects independently, engaging directly with clients.  Managed the design process, while coordinating with a UI designer to ensure a cohesive user experience.`,
    ],
    tags: ["Web", "Mobile", "UI"],
  },
];

export default jobsList;
