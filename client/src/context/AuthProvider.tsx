import { useState, useEffect, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { AuthContext, User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const USER_KEY = "user";
  const [cookies, setCookie, removeCookie] = useCookies([USER_KEY]);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  // Check if user exists in cookies on initial load
  useEffect(() => {
    const user = cookies[USER_KEY];

    if (user) {
      setAuthenticated(true);
      setUser(user);
    }
  }, [cookies]);

  const login = async (userCredentials: User) => {
    const tryLogin = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    });
    if (!tryLogin.ok) {
      throw new Error("Login failed");
    }
    const loggedInUser = await tryLogin.json();
    setUser(loggedInUser);
    const expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + 3600 * 1000); // 1 hour
    setCookie(USER_KEY, loggedInUser, {
      path: "/",
      expires: expirationTime,
    });
    setAuthenticated(true);
  };

  const logout = () => {
    try {
      removeCookie(USER_KEY, { path: "/" });
      setAuthenticated(false);
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
