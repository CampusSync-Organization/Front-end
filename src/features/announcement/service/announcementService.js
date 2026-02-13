import { posts } from "./dummydata";

export const announcementService = {
  fetchannouncement: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(posts);
      }, 500);
    });
  },

  fetchByCategory: async ({ category }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(posts.filter((item) => item.category == category));
      }, 500);
    });
  },
};
