"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  VIBE_COLORS,
  VIBE_COLOR_KEYS,
  type VibeColorKey,
} from "@/lib/vibeColor";

interface VibeColorPickerProps {
  initialKey: VibeColorKey;
}

export default function VibeColorPicker({ initialKey }: VibeColorPickerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<VibeColorKey>(initialKey);
  const [saving, setSaving] = useState(false);
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

  async function pick(key: VibeColorKey) {
    if (key === selected) return;
    const previous = selected;
    const myRequest = ++requestIdRef.current;
    setSelected(key);
    setError(null);
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (myRequest === requestIdRef.current) {
        setSelected(previous);
        setSaving(false);
        flashError("You must be signed in.");
      }
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        vibe_color: key,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (myRequest !== requestIdRef.current) return;

    if (updateError) {
      setSelected(previous);
      setSaving(false);
      flashError(updateError.message);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2.5">
      <span
        id="vibe-color-label"
        className="font-figtree text-[10px] font-medium uppercase tracking-[0.16em] text-brand-50/40"
      >
        Vibe
      </span>
      <div
        role="radiogroup"
        aria-labelledby="vibe-color-label"
        className="flex gap-1.5"
      >
        {VIBE_COLOR_KEYS.map((key) => {
          const c = VIBE_COLORS[key];
          const isSelected = key === selected;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={c.name}
              onClick={() => pick(key)}
              disabled={saving}
              className="h-[18px] w-[18px] rounded-[5px] border border-white/10 transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06160d] disabled:cursor-wait"
              style={{
                background: c.hex,
                boxShadow: isSelected
                  ? "0 0 0 2px #06160d, 0 0 0 4px rgba(245,210,139,0.55)"
                  : undefined,
              }}
            />
          );
        })}
      </div>
      {error ? (
        <span className="font-figtree text-[11px] text-red-300">{error}</span>
      ) : null}
    </div>
  );
}
