export const httpClient = {
  get: async (url) => {
    console.log("GET", url);
  },
  post: async (url, data) => {
    console.log("POST", url, data);
  },
};
