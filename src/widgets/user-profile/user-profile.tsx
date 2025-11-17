"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { User } from "@supabase/supabase-js";
import { Trophy, Coins, Zap, Mail, Calendar, Shield } from "lucide-react";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="space-y-6">
      <Card className="neon-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Профиль игрока
            </CardTitle>
            <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 text-sm">
              VIP
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center neon-glow flex-shrink-0">
              <span className="text-4xl font-bold text-background">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="text-2xl font-semibold text-foreground break-all">{user.email}</h3>
              <p className="text-muted-foreground font-mono">ID: {user.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-xl font-semibold text-foreground mb-4">Статистика</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card/50 border border-primary/30 neon-border">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Побед</p>
                    <p className="text-2xl font-bold text-primary">0</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card/50 border border-secondary/30 neon-border">
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-secondary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Lucky Coins</p>
                    <p className="text-2xl font-bold text-secondary">1000</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card/50 border border-accent/30 neon-border">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Серия побед</p>
                    <p className="text-2xl font-bold text-accent">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-xl font-semibold text-foreground mb-4">Информация об аккаунте</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/30">
                <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground break-all">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/30">
                <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Дата регистрации</p>
                  <p className="text-foreground">
                    {new Date(user.created_at ?? "").toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/30">
                <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Email подтвержден</p>
                    <p className={user.email_confirmed_at ? "text-accent font-semibold" : "text-destructive"}>
                      {user.email_confirmed_at ? "Да" : "Нет"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Статус</p>
                    <p className="text-accent font-semibold">Активен</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
