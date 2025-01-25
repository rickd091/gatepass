import { useMsal } from "@azure/msal-react";
import { Button } from "@/components/ui/button";
import { loginRequest } from "@/lib/auth";

export const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error("Login failed:", error);
    });
  };

  return (
    <Button onClick={handleLogin} className="w-full">
      Sign in with KMA Active Directory
    </Button>
  );
};
