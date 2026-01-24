# CampusSync

CampusSync is an AI-based platform designed for university students to find compatible and effective project teammates. By analyzing both academic performance and personality traits, the platform fosters balanced teams and meaningful connections.

## Core Features

- **AI Recommendation System**: Generates explainable recommendations for compatible teammates based on academic scores, personality traits, and shared interests.
- **Interactive Assessments**: Comprehensive onboarding that collects academic information, project history, and personality traits to build a compatibility profile.
- **Profile Management**: Customizable user profiles featuring skill tags (e.g., "Coder", "Designer"), academic details, and project history.
- **Real-time Connect & Chat**: Secure messaging system with AI-powered moderation to detect toxic content and encourage professional communication.
- **Student Announcements**: Project-specific posts where students can advertise team openings with details like course name, deadline, and specific requirements.
- **Peer Review System**: Verified collaboration feedback and ratings that influence future recommendation scores.
- **Events & Communities**: Hub for joining clubs, project groups, and campus-wide events.
- **Admin Dashboard**: Centralized control for managing content, monitoring system usage, and adjusting recommendation algorithm weights.

## Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **State Management:** Redux Toolkit
- **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **HTTP Client:** [Axios](https://axios-http.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd campussync-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Starts the development server with HMR.
- `npm run build` - Builds the application for production.
- `npm run lint` - Runs ESLint to check for code quality issues.
- `npm run preview` - Previews the production build locally.
