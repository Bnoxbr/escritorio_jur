export interface SessionPayload {
  openId: string;
  appId: string;
  name: string;
}

export interface UserInfo {
  openId: string;
  name: string;
  email?: string | null;
  loginMethod?: string | null;
}
