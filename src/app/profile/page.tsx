import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileActivityFeed from "@/components/profile/ProfileActivityFeed";
import {
  buildProfileActivityDisplayRows,
  fetchCampfireActivityForUser,
} from "@/lib/profileActivityFeed";
import { fetchProfileStatsForUser } from "@/lib/profileStats";
import {
  DEFAULT_VIBE_COLOR,
  isVibeColorKey,
  resolveVibeColor,
  type VibeColorKey,
} from "@/lib/vibeColor";
import ProfileHero from "./ProfileHero";
import ProfileStatsRow from "./ProfileStats";
import ProfileActivityMarker from "./ProfileActivityMarker";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [profileRes, activityItems, stats] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    fetchCampfireActivityForUser(supabase, user.id),
    fetchProfileStatsForUser(supabase, user.id),
  ]);

  const profile = profileRes.data;
  const activityRows = buildProfileActivityDisplayRows(activityItems);

  const vibeKey: VibeColorKey = isVibeColorKey(profile?.vibe_color)
    ? profile.vibe_color
    : DEFAULT_VIBE_COLOR;
  const vibe = resolveVibeColor(vibeKey);

  const memberSinceLabel = `Member since ${new Date(user.created_at).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  )}`;

  return (
    <div className="flex min-h-screen items-start justify-center px-6 py-32">
      <div className="w-full max-w-lg">
        <h1 className="sr-only">
          Your profile{profile?.display_name ? ` — ${profile.display_name}` : ""}
        </h1>

        <ProfileHero
          initialDisplayName={profile?.display_name ?? ""}
          initialBio={profile?.bio ?? ""}
          initialAvatarUrl={profile?.avatar_url ?? null}
          initialVibeKey={vibeKey}
          vibe={vibe}
          memberSinceLabel={memberSinceLabel}
        />

        <ProfileStatsRow stats={stats} vibe={vibe} />

        <ProfileActivityFeed rows={activityRows} />

        <ProfileActivityMarker />
      </div>
    </div>
  );
}
