"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { User } from "@supabase/supabase-js";
import { Trophy, Coins, Zap } from "lucide-react";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="space-y-6">
      <Card className="neon-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Player Profile
            </CardTitle>
            <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 text-sm">
              VIP
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center neon-glow">
              <span className="text-3xl font-bold text-background">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-foreground">{user.email}</h3>
              <p className="text-muted-foreground">Lucky Player #{user.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-card/50 border border-primary/30 neon-border">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Wins</p>
                  <p className="text-2xl font-bold text-primary">0</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card/50 border border-secondary/30 neon-border">
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Lucky Coins</p>
                  <p className="text-2xl font-bold text-secondary">1000</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card/50 border border-accent/30 neon-border">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Win Streak</p>
                  <p className="text-2xl font-bold text-accent">0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground">Account Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground">
                  {new Date(user.created_at ?? "").toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Status</span>
                <span className="text-accent font-semibold">Active</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Email Verified</span>
                <span className={user.email_confirmed_at ? "text-accent" : "text-destructive"}>
                  {user.email_confirmed_at ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
