import { AuthButton } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Trophy, Sparkles, Coins, Zap, Star, Gamepad2, Lock } from "lucide-react";
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

      <div className="flex-1 flex flex-col items-center justify-center">
        {user ? (
          // Заглушка для зарегистрированных пользователей
          <section className="w-full max-w-4xl px-6 py-20">
            <Card className="neon-card">
              <CardHeader className="text-center space-y-4 pb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center neon-glow">
                  <Gamepad2 className="w-12 h-12 text-background" />
                </div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Coming Soon!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-xl text-muted-foreground">
                  Exciting casino games are on their way
                </p>
                <p className="text-foreground/80">
                  We&apos;re working hard to bring you the best gaming experience.
                  Stay tuned for amazing games, big wins, and endless fun!
                </p>
                <div className="pt-6">
                  <Link href="/profile">
                    <Button className="neon-glow bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-lg px-8 py-6">
                      View Your Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        ) : (
          // Контент для незарегистрированных пользователей
          <>
            <section className="w-full py-20 px-6">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-6xl md:text-8xl font-bold neon-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    LUCKY GAME
                  </h1>
                  <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto">
                    Онлайн казино с неоновым дизайном
                  </p>
                </div>

                <Card className="neon-card max-w-2xl mx-auto">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4">
                      <Lock className="w-8 h-8 text-background" />
                    </div>
                    <CardTitle className="text-2xl text-center">
                      Для доступа к игре необходима регистрация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    <p className="text-lg text-muted-foreground">
                      Зарегистрируйтесь сейчас и получите бесплатные бонусы для старта!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Link href="/auth/sign-up">
                        <Button className="neon-glow bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-lg px-8 py-6 w-full sm:w-auto">
                          <Star className="w-5 h-5 mr-2" />
                          Регистрация
                        </Button>
                      </Link>
                      <Link href="/auth/login">
                        <Button variant="outline" className="neon-border text-lg px-8 py-6 w-full sm:w-auto">
                          Войти
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="w-full py-16 px-6 bg-gradient-to-b from-background to-card/50">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Что вас ждет?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="neon-card">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                        <Trophy className="w-6 h-6 text-background" />
                      </div>
                      <CardTitle className="text-xl text-primary">Большие выигрыши</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Испытайте удачу и выиграйте крупные джекпоты
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="neon-card">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4">
                        <Coins className="w-6 h-6 text-background" />
                      </div>
                      <CardTitle className="text-xl text-secondary">Бесплатные монеты</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Получите 1000 Lucky Coins при регистрации
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="neon-card">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-background" />
                      </div>
                      <CardTitle className="text-xl text-accent">Быстрая игра</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Молниеносный геймплей с потрясающей графикой
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <footer className="w-full border-t border-primary/30 py-8 px-6 text-center">
        <p className="text-muted-foreground">
          Lucky Game - Where Fortune Favors the Bold
        </p>
      </footer>
    </main>
  );
}
