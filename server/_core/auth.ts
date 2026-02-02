import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { getSessionCookieOptions } from "./cookies.js";
import { sdk } from "./sdk.js";
import { ENV } from "./env.js";

export function registerAuthRoutes(app: Express) {
  // Simple dev login route
  app.get("/api/auth/dev-login", async (req: Request, res: Response) => {
    if (ENV.isProduction) {
        res.status(403).json({ error: "Not available in production" });
        return;
    }

    try {
      const devUser = await sdk.ensureDevUser();
      
      const sessionToken = await sdk.createSessionToken(devUser.openId, {
        name: devUser.name || "Dev User",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[Auth] Dev login failed", error);
      res.status(500).json({ error: "Dev login failed" });
    }
  });

  app.get("/api/auth/logout", (req: Request, res: Response) => {
      const cookieOptions = getSessionCookieOptions(req);
      res.clearCookie(COOKIE_NAME, cookieOptions);
      res.redirect(302, "/");
  });
}
