"use client";
import { createContext, useContext } from "react";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const AuthContext = createContext<RequestCookie | undefined>(undefined);

export const AuthProvider = ({
  children,
  token,
}: {
  children: React.ReactNode;
  token: RequestCookie | undefined;
}) => {
  return <AuthContext.Provider value={token}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used in provider");
  return context;
};
