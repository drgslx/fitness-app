import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onIdTokenChanged } from "firebase/auth";
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const auth = Object.values(config).every(Boolean)
  ? getAuth(initializeApp(config))
  : null;
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    admin: false,
    loading: !!auth,
  });
  useEffect(() => {
    if (!auth) return;
    let active = true,
      version = 0;
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      const request = ++version;
      try {
        const token = user ? await user.getIdTokenResult() : null;
        if (active && request === version)
          setState({
            user,
            admin: token?.claims.admin === true,
            loading: false,
          });
      } catch {
        if (active && request === version)
          setState({ user: null, admin: false, loading: false });
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
