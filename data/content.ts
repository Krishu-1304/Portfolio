export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  github: string;
  demoUrl?: string;
  accent: string;
  year: string;
  enabled: boolean;
  visualType: "infant-monitor" | "voca-health";
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  university: string;
  location: string;
  period: string;
  cgpa: string;
}

export const FEATURE_FLAGS = {
  SHOW_EXPERIENCE: false,
};

export const PERSONAL_INFO = {
  name: "Krish Prajapati",
  role: "Computer Engineering Student · Builder",
  headlinePrefix: "Hi, I'm Krish. I build",
  rotatingRoles: [
    "Systems & Apps",
    "Data Dashboards",
    "ML Projects",
    "Mobile Apps",
  ],
  intro:
    "Computer Engineering student at DJSCE Mumbai. I build practical ML systems, data pipelines, and responsive apps.",
  email: "prajapatikrish816@gmail.com", // Single source of truth for email
  resumeUrl: "/Krish_Prajapati_Resume.pdf",
  github: "https://github.com/Krishu-1304",
  linkedin: "https://www.linkedin.com/in/krish-prajapati-37a741388",
  location: "Mumbai, India",
  timezone: "Asia/Kolkata",
  timeOffset: "GMT +5:30",
  cgpa: "9.10",
  badgeDegree: "B.TECH · COMPUTER ENGINEERING",
  badgeCollege: "DJSCE · MUMBAI",
  badgePeriod: "2024–2028",
};

export const ABOUT_PARAGRAPHS = [
  "Engineering student at DJSCE Mumbai, turning ideas into reliable software.",
  "I work across machine learning, full-stack tools, and data analytics to solve practical problems.",
  "Beyond code: product architecture, tech ventures, and cricket.",
];

export const EDUCATION: Education = {
  degree: "B.Tech",
  field: "Computer Engineering",
  institution: "Dwarkadas J. Sanghvi College of Engineering (DJSCE)",
  university: "University of Mumbai",
  location: "Mumbai, India",
  period: "2024–2028 (Expected)",
  cgpa: "9.10",
};

export const SKILLS_GROUPED = {
  languages: ["Python", "Java", "C", "SQL"],
  frameworks: ["Django", "Flutter", "FastAPI"],
  dataAndBI: ["Power BI", "Tableau", "YAMNet", "BiLSTM"],
};

export const AREAS_I_EXPLORE = [
  {
    title: "Artificial Intelligence",
    description: "Deep learning models, audio classification, and intelligent agents.",
  },
  {
    title: "Product Building",
    description: "Designing end-to-end software tools built for human utility.",
  },
  {
    title: "Business & Strategy",
    description: "Connecting technical architecture with unit economics and market value.",
  },
  {
    title: "Entrepreneurship",
    description: "Iterating on first-principles ideas to solve genuine friction.",
  },
];

export const BEYOND_THE_SCREEN = [
  {
    title: "Cricket & Sports",
    description: "Competitive cricket, match tactics, and athletic fitness.",
    tag: "Athletics",
  },
  {
    title: "Movies & Web Series",
    description: "Cinematic narratives, pacing, and visual world-building.",
    tag: "Culture",
  },
  {
    title: "Learning New Things",
    description: "Exploring emerging technology, system mechanics, and curiosity projects.",
    tag: "Growth",
  },
  {
    title: "Creative Exploration",
    description: "Studying visual systems, typography hierarchy, and photography.",
    tag: "Creative",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "infant-monitoring",
    title: "AI-Based Smart Infant Monitoring System",
    subtitle: "Audio Cry Classification & Flutter Client",
    description:
      "Acoustic deep learning classifier detecting infant cries in real-time. Built with FastAPI, YAMNet + BiLSTM, and a Flutter mobile interface.",
    tags: ["FastAPI", "YAMNet", "BiLSTM", "Flutter", "Python"],
    github: "https://github.com/Krishu-1304",
    accent: "#B8935A",
    year: "2024",
    enabled: true,
    visualType: "infant-monitor",
  },
  {
    id: "voca-health",
    title: "VocaHealth",
    subtitle: "Voice Biomarker Health Tracking",
    description:
      "Exploratory voice health tracker extracting vocal acoustic biomarkers (pitch, jitter, shimmer) to analyze anomaly patterns.",
    tags: ["Python", "Audio DSP", "Machine Learning", "MFCC"],
    github: "https://github.com/Krishu-1304",
    accent: "#CDAA73",
    year: "2024",
    enabled: true,
    visualType: "voca-health",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#doors" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];
