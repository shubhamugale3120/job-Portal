import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// The useAuth hook is a custom React hook that provides an easy way to access the authentication context throughout the application. It uses the useContext hook to consume the AuthContext, which contains information about the current user, loading state, and authentication functions like login and logout. By using this hook, components can easily access authentication-related data and functions without needing to directly interact with the context provider.