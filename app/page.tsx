import { AuthButton } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Trophy, Sparkles, Coins, Zap, Star, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { createServerClient } from "@/shared/api/supabase";

export default async function Home() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-primary/30 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              LUCKY GAME
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <Link href="/profile">
                <Button variant="outline" className="neon-border">
                  Profile
                </Button>
              </Link>
            )}
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center">
        <section className="w-full py-20 px-6">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold neon-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                LUCKY GAME
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Experience the thrill of the casino with neon-powered gaming
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <>
                  <Link href="/protected">
                    <Button className="neon-glow bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-lg px-8 py-6">
                      <Gamepad2 className="w-5 h-5 mr-2" />
                      Start Playing
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="neon-border text-lg px-8 py-6">
                      View Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/sign-up">
                    <Button className="neon-glow bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-lg px-8 py-6">
                      <Star className="w-5 h-5 mr-2" />
                      Join Now
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" className="neon-border text-lg px-8 py-6">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="w-full py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Play Lucky Game?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="neon-card">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-background" />
                  </div>
                  <CardTitle className="text-xl text-primary">Big Wins</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Experience massive payouts and exciting jackpots with every spin
                  </p>
                </CardContent>
              </Card>

              <Card className="neon-card">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4">
                    <Coins className="w-6 h-6 text-background" />
                  </div>
                  <CardTitle className="text-xl text-secondary">Free Coins</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start with 1000 lucky coins and earn more as you play
                  </p>
                </CardContent>
              </Card>

              <Card className="neon-card">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-background" />
                  </div>
                  <CardTitle className="text-xl text-accent">Fast Play</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Lightning-fast gameplay with stunning neon graphics
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16 px-6 bg-gradient-to-b from-background to-card/50">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              Ready to Get Lucky?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of players and start your winning streak today
            </p>
            {!user && (
              <Link href="/auth/sign-up">
                <Button className="neon-glow bg-gradient-to-r from-secondary to-accent hover:from-secondary/80 hover:to-accent/80 text-lg px-12 py-6 mt-6">
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </section>
      </div>

      <footer className="w-full border-t border-primary/30 py-8 px-6 text-center">
        <p className="text-muted-foreground">
          Lucky Game - Where Fortune Favors the Bold
        </p>
      </footer>
    </main>
  );
}
