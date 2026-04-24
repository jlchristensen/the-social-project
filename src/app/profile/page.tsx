import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileActivityFeed from "@/components/profile/ProfileActivityFeed";
import { fetchCampfireActivityForUser } from "@/lib/profileActivityFeed";
import ProfileForm from "./ProfileForm";
import ProfileActivityMarker from "./ProfileActivityMarker";

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

  const activityItems = await fetchCampfireActivityForUser(supabase, user.id);

  return (
    <div className="flex min-h-screen items-start justify-center px-6 py-32">
      <div className="w-full max-w-lg">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-brand-50 mb-2">
            Your profile
          </h1>
          <p className="text-brand-50/60 text-lg">
            This is how other community members will see you.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-brand-50/10 bg-white/[0.04] px-5 py-4">
          <p className="text-sm text-brand-50/65">
            <span className="font-medium text-brand-100">Email:</span>{" "}
            {user.email}
          </p>
          <p className="mt-1 text-sm text-brand-50/65">
            <span className="font-medium text-brand-100">Member since:</span>{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <ProfileActivityFeed items={activityItems} />

        <ProfileActivityMarker />
        <ProfileForm
          initialDisplayName={profile?.display_name ?? ""}
          initialBio={profile?.bio ?? ""}
        />
      </div>
    </div>
  );
}
