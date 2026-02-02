export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const getLoginUrl = () => {
  if (import.meta.env.DEV) {
    return "/api/auth/dev-login";
  }
  return "/login"; // Placeholder for production login page
};
