import { createContext, useContext } from "react";

export interface User {
  id?: number;
  email: string;
  password?: string;
  name: string;
}

interface AuthContextInterface {
  authenticated: boolean;
  login: (user: User) => Promise<void>;
  logout: () => void;
  user: User | undefined;
}
export const AuthContext = createContext<AuthContextInterface | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
