import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setUser(session?.user ?? null);

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };

  }, []);

  async function getUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    setLoading(false);
  }

  async function logout() {

    await supabase.auth.signOut();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}