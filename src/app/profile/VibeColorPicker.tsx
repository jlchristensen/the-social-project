"use client";

import { useState, useTransition } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function pick(key: VibeColorKey) {
    if (key === selected || isPending) return;
    const previous = selected;
    setSelected(key);
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSelected(previous);
        setError("You must be signed in.");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          vibe_color: key,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setSelected(previous);
        setError(updateError.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2.5">
      <span className="font-figtree text-[10px] font-medium uppercase tracking-[0.16em] text-brand-50/40">
        Vibe
      </span>
      <div className="flex gap-1.5">
        {VIBE_COLOR_KEYS.map((key) => {
          const c = VIBE_COLORS[key];
          const isSelected = key === selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => pick(key)}
              aria-label={c.name}
              aria-pressed={isSelected}
              className="h-[18px] w-[18px] rounded-[5px] border border-white/10 transition-transform hover:scale-110 focus:outline-none"
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
