import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/shared/api/supabase/server";
import { UserProfile } from "@/widgets/user-profile";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-primary/30 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              LUCKY GAME
            </span>
          </Link>
          <Link href="/">
            <Button variant="outline" className="neon-border">
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-4xl">
          <UserProfile user={data.user} />
        </div>
      </div>
    </div>
  );
}
