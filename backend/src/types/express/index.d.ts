export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
