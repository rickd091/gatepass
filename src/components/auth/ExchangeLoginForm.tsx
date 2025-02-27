import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { exchangeAuth } from "@/lib/exchange-auth";

export const ExchangeLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await exchangeAuth.login(username, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.user?.displayName}`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description:
          error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Signing in...
            </>
          ) : (
            "Sign in with Exchange"
          )}
        </Button>
      </form>
    </Card>
  );
};
