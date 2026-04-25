"use client";

import AvatarPicker from "./AvatarPicker";
import InlineTextField from "./InlineTextField";
import VibeColorPicker from "./VibeColorPicker";
import type { VibeColor, VibeColorKey } from "@/lib/vibeColor";

interface ProfileHeroProps {
  initialDisplayName: string;
  initialBio: string;
  initialAvatarUrl: string | null;
  initialVibeKey: VibeColorKey;
  vibe: VibeColor;
  memberSinceLabel: string;
}

export default function ProfileHero({
  initialDisplayName,
  initialBio,
  initialAvatarUrl,
  initialVibeKey,
  vibe,
  memberSinceLabel,
}: ProfileHeroProps) {
  return (
    <div className="mb-7 border-b border-brand-50/10 pb-5">
      <div className="mb-4 flex items-center gap-[18px]">
        <AvatarPicker
          initialAvatarUrl={initialAvatarUrl}
          initialDisplayName={initialDisplayName}
          vibe={vibe}
        />
        <div className="min-w-0">
          <InlineTextField
            column="display_name"
            initialValue={initialDisplayName}
            placeholder="Add your name"
            required
            maxLength={50}
            textClassName="font-display text-[28px] font-medium leading-tight text-brand-50"
          />
          <p className="mt-1 font-display text-[13px] italic text-brand-50/50">
            {memberSinceLabel}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <InlineTextField
          column="bio"
          initialValue={initialBio}
          placeholder="Add a bio so others know who you are."
          multiline
          maxLength={300}
          textClassName="font-display text-[17px] leading-snug text-brand-50/85"
        />
      </div>

      <VibeColorPicker initialKey={initialVibeKey} />
    </div>
  );
}
