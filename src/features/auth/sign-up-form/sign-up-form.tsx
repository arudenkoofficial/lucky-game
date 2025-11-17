"use client";

import { cn } from "@/shared/lib/utils";
import { createClient } from "@/shared/api/supabase/client";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="neon-card">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-bold neon-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            JOIN THE GAME
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Create your lucky account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground/90">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="player@luckygame.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neon-border bg-card/50 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-foreground/90">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="neon-border bg-card/50 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password" className="text-foreground/90">Confirm Password</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="neon-border bg-card/50 focus:ring-2 focus:ring-primary"
                />
              </div>
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/50">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full neon-glow bg-gradient-to-r from-secondary to-accent hover:from-secondary/80 hover:to-accent/80 text-secondary-foreground font-semibold text-lg py-6"
                disabled={isLoading}
              >
                {isLoading ? "Joining Casino..." : "Start Playing"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already a player?</span>{" "}
              <Link
                href="/auth/login"
                className="text-accent hover:text-accent/80 font-semibold underline-offset-4 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
