import { redirect } from "next/navigation";
import { createServerClient } from "@/shared/api/supabase";
import { UserProfile } from "@/widgets/user-profile";

export default async function ProfilePage() {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
        <UserProfile user={data.user} />
      </div>
    </div>
  );
}
