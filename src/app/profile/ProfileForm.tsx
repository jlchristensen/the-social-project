"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ProfileFormProps {
  initialDisplayName: string;
  initialBio: string;
}

export default function ProfileForm({
  initialDisplayName,
  initialBio,
}: ProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to update your profile.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: displayName.trim(),
        bio: bio.trim(),
        updated_at: new Date().toISOString(),
      });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClasses =
    "w-full rounded-xl border border-brand-50/15 bg-white/[0.04] px-4 py-3 text-brand-50 placeholder:text-brand-50/40 focus:border-ember focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-ember/25 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="display-name"
          className="block text-sm font-medium text-brand-100 mb-1.5"
        >
          Display name
        </label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How should we call you?"
          maxLength={50}
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-brand-100 mb-1.5"
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the community a bit about yourself..."
          rows={4}
          maxLength={300}
          className={`${inputClasses} resize-none`}
        />
        <p className="mt-1 text-right text-xs text-brand-50/40">
          {bio.length}/300
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-xl bg-brand-700/30 border border-brand-200/30 px-4 py-3 text-sm text-brand-100">
          Profile saved successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-ember px-4 py-3.5 text-sm font-semibold text-brand-900 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(245,210,139,0.4)] focus:outline-none focus:ring-2 focus:ring-ember/40 focus:ring-offset-2 focus:ring-offset-[#06160d] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
