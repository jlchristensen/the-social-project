import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen items-start justify-center px-6 py-32">
      <div className="w-full max-w-lg">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-brand-900 mb-2">
            Your profile
          </h1>
          <p className="text-brand-700/60 text-lg">
            This is how other community members will see you.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-brand-100 bg-brand-50/50 px-5 py-4">
          <p className="text-sm text-brand-700/50">
            <span className="font-medium text-brand-700">Email:</span>{" "}
            {user.email}
          </p>
          <p className="mt-1 text-sm text-brand-700/50">
            <span className="font-medium text-brand-700">Member since:</span>{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <ProfileForm
          initialDisplayName={profile?.display_name ?? ""}
          initialBio={profile?.bio ?? ""}
        />
      </div>
    </div>
  );
}
