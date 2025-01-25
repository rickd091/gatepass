import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/lib/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};
