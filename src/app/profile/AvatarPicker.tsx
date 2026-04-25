"use client";

import { useEffect, useRef, useState } from "react";
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
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

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
  const requestIdRef = useRef(0);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  function flashError(message: string) {
    setError(message);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setError(null), 5000);
  }

  function openPicker() {
    if (uploading) return;
    fileInputRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
      flashError("Please choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      flashError("Image must be under 2 MB.");
      return;
    }

    const myRequest = ++requestIdRef.current;
    setUploading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (myRequest === requestIdRef.current) {
        setUploading(false);
        flashError("You must be signed in.");
      }
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

    if (myRequest !== requestIdRef.current) return;

    if (uploadError) {
      setUploading(false);
      flashError(uploadError.message);
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

    if (myRequest !== requestIdRef.current) return;

    setUploading(false);

    if (updateError) {
      flashError(updateError.message);
      return;
    }

    setAvatarUrl(publicUrl);
    router.refresh();
  }

  const fallbackChar =
    initialDisplayName.trim().charAt(0).toUpperCase() || "?";
  const ringStyle = { boxShadow: `0 0 0 3px ${vibe.hex}` };
  const fallbackGradient = `linear-gradient(135deg, ${vibe.hexLight}, ${vibe.hexDark})`;
  const altText = `${initialDisplayName.trim() || "Your"} avatar`;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={openPicker}
        disabled={uploading}
        aria-label="Change avatar"
        className="relative h-[76px] w-[76px] flex-shrink-0 overflow-visible rounded-full transition-transform hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06160d] disabled:cursor-wait"
        style={ringStyle}
      >
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
          {avatarUrl ? (
            // `unoptimized` keeps avatars off Next's image optimizer so we don't
            // need to whitelist the Supabase storage host in next.config.ts.
            // Acceptable here because the rendered size is fixed at 76px.
            <Image
              src={avatarUrl}
              alt={altText}
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
