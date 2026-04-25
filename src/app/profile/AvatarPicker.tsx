"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { VibeColor } from "@/lib/vibeColor";

interface AvatarPickerProps {
  initialAvatarUrl: string | null;
  initialDisplayName: string;
  vibe: VibeColor;
}

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export default function AvatarPicker({
  initialAvatarUrl,
  initialDisplayName,
  vibe,
}: AvatarPickerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openPicker() {
    if (uploading) return;
    fileInputRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 2 MB.");
      return;
    }

    setUploading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      setError("You must be signed in.");
      return;
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const objectPath = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(objectPath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(objectPath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setUploading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setAvatarUrl(publicUrl);
    router.refresh();
  }

  const fallbackChar =
    initialDisplayName.trim().charAt(0).toUpperCase() || "?";
  const ringStyle = { boxShadow: `0 0 0 3px ${vibe.hex}` };
  const fallbackGradient = `linear-gradient(135deg, ${vibe.hexLight}, ${vibe.hexDark})`;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={openPicker}
        disabled={uploading}
        aria-label="Change avatar"
        className="relative h-[76px] w-[76px] flex-shrink-0 overflow-visible rounded-full transition-transform hover:-translate-y-px focus:outline-none disabled:cursor-wait"
        style={ringStyle}
      >
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={76}
              height={76}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center font-display text-[30px] font-bold text-brand-900"
              style={{ background: fallbackGradient }}
            >
              {fallbackChar}
            </span>
          )}
        </span>
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-900 bg-ember text-[12px] font-bold text-brand-900"
        >
          {uploading ? "…" : "✎"}
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
      />
      {error ? (
        <span className="mt-2 max-w-[180px] font-figtree text-[11px] text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}
