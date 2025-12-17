export const MOCK_USER = {
  id: "1",
  firstName: "Alexa",
  lastName: "Rawles",
  email: "alexarawles@gmail.com",
  avatar: "https://placehold.co/94x94",
  college: "Cairo University",
  faculty: "Computer Science",
  gpa: 3.0,
  gender: "Female",
  bio: "I’m a computer science student passionate about building impactful software that combines creativity and problem-solving. I love exploring new technologies — especially AI, app development, and cloud systems — and I’m always looking for opportunities to grow through real-world projects and collaborations.",
  tags: ["Reader", "Coder", "Morning Person"],
  goals: "To gain more experience in machine learning",
};

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Vision Project",
    category: "web development",
    status: "In-progress",
    startDate: "9/15/2025",
    endDate: "9/15/2025",
    members: 3,
    description: "Need 1 backend dev and 1 UI/UX designer",
  },
  {
    id: 2,
    title: "Machine learning project",
    category: "AI",
    status: "Done",
    startDate: "9/15/2025",
    endDate: "9/15/2025",
    members: 3,
    description: "Looking for passionate machine learning engineers",
  },
];

export const MOCK_OTHER_USER = {
  id: "2",
  firstName: "Alexa",
  lastName: "Rawles", // Keeping same name as per user snippet provided, or should I vary? The snippet uses "Alexa Rawles".
  avatar: "https://placehold.co/94x94",
  college: "Cairo University",
  faculty: "Computer Science",
  gpa: 3.0,
  tags: ["Reader", "Coder", "Morning Person"],
  lastSeen: "2 hours ago",
  announcements: [
    {
      id: 1,
      title: "Vision Project",
      category: "web development",
      status: "Join", // Or In-progress, but action is Join
      startDate: "9/15/2025",
      endDate: "9/15/2025",
      members: 3,
      description: "Need 1 backend dev and 1 UI/UX designer",
      action: "Join",
    },
    {
      id: 2,
      title: "Vision Project", // Repeated in snippet
      category: "web development",
      status: "Full",
      startDate: "9/15/2025",
      endDate: "9/15/2025",
      members: 3,
      description: "Need 1 backend dev and 1 UI/UX designer",
      action: "Full",
    },
  ],
  projects: [
    {
      id: 3,
      title: "Machine learning project",
      category: "AI",
      status: "Done",
      startDate: "9/15/2025",
      endDate: "9/15/2025",
      members: 3,
      description: "Looking for passionate machine learning engineers",
    },
  ],
  reviews: [
    {
      id: 1,
      author: "Sara A.",
      avatar: "https://placehold.co/18x15",
      text: "Great collaborator — reliable and good at debugging.",
      rating: 5,
    },
    {
      id: 2,
      author: "Omar T.",
      avatar: "https://placehold.co/18x15",
      text: "Strong technical skills. Could improve on docs.",
      rating: 4,
    },
  ],
};
