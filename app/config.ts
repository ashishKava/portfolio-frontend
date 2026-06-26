export const CONFIG = {
  name: "Ashish Kava",
  title: "Software Engineer / Full-Stack Developer",
  email: "ashishkava1108@gmail.com",
  phone: "+91 7984200009",
  location: "Ahmedabad, Gujarat, India",
  github: "https://github.com/ashishkava1108",
  linkedin: "https://linkedin.com/in/ashish-kava", // reasonable default matching his profile
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  skills: {
    frontend: ["ReactJS", "Javascript", "Typescript", "HTML", "CSS", "Material-UI"],
    backend: ["Node.js", "Express", "GraphQL", "Ruby on Rails"],
    databases: ["MongoDB", "PostgreSQL", "Prisma", "Sequelize"],
    tools: ["Git", "Docker", "AWS", "WebSockets", "Jest"]
  },
  education: {
    institution: "Knowledge Institute of Technology and Engineering",
    degree: "Bachelor of Engineering (B.E.)",
    duration: "Aug 2017 - May 2021",
    location: "Anand, Gujarat"
  },
  courses: [
    {
      name: "AWS - Generative AI Essentials",
      provider: "Amazon Web Services"
    }
  ]
};
