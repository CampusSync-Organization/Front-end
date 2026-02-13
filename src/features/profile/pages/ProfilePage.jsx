import React from "react";
import { MOCK_USER, MOCK_ANNOUNCEMENTS } from "../api/mockData";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileAbout } from "../components/ProfileAbout";
import { ProfileInfo } from "../components/ProfileInfo";
import { ProfileAnnouncements } from "../components/ProfileAnnouncements";
import { ProfileSecurity } from "../components/ProfileSecurity";
import { UserProjects } from "../components/UserProjects";
import { UserReviews } from "../components/UserReviews";

// Mock Projects Data (if not present in mockData)
const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Campus Insights Dashboard",
    description:
      "A real-time dashboard visualizing student engagement across various campus events using React and D3.js.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-3zGZeQgHbLC8QTEtuCBCluKF1dY6eVjBxxcOYsUJVq1aDLm5C-4OJzc8By7FQREoK95ie7sUjWOXModxevhfxZ2NnCZmOZVN_II5O5xP1Cj0fGfk0vI0m2sbaeKBqFXGJSa3xDS6JFFD9e-hqx4-gv7JjsuWnzmdAHf8oTpeNDNShbyIq9Jo-QSxZDqzHNci2Ci-cQAxrynQ_JW8WHEMv8zEBTryPvBJFjapOxIuzbgjghkhTPHOtf3KCH6WlLsjN_vGoxU7lALj",
    techStack: ["React", "Firebase"],
    featured: true,
  },
  {
    id: 2,
    title: "EcoBot Pathfinding",
    description:
      "Optimized algorithm for autonomous waste collection robots in indoor environments using ROS.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4Kmdt8_RtSGPgwpfEG316IhfhWjF3gVYaGhLVzZTc-T8DQ_DCiucgrb2W9aa-rDVl0HYSXDu3w0rzwoQ-Nin9iEQoYxnOjGk4CSLKH8LqCpcAXfChAhWzhFhbzoY2dKO5ZYZ25WZcA22SqoDgrKKwyep2ehgWcTbIgws7D_msNxxrfjHZWoamZVwMBnCWyCqD2HJUEILXiiMI2tE16c72VopSNLovkY8CJ4wNKLRAesAmECHe484lQLa2UFiTETnNe4LgBv4S7htT",
    techStack: ["Python", "ROS"],
    featured: false,
  },
];

const ProfilePage = () => {
  // In a real app, these would come from Redux or an API hook
  const user = MOCK_USER;
  const announcements = MOCK_ANNOUNCEMENTS;
  const projects = MOCK_PROJECTS;

  return (
    <div className="min-h-screen bg-background-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader user={user} />
        <ProfileAbout user={user} />
        <ProfileInfo user={user} />
        <ProfileAnnouncements announcements={announcements} />
        <UserProjects projects={projects} />
        <UserReviews reviews={user.reviews || []} />
        <ProfileSecurity user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
