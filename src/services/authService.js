import { httpClient } from "./httpClient";
export const authService = {
  login: (creds) => httpClient.post("/login", creds),
};
