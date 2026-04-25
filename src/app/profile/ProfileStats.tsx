import type { ProfileStats } from "@/lib/profileStats";
import type { VibeColor } from "@/lib/vibeColor";

interface ProfileStatsRowProps {
  stats: ProfileStats;
  vibe: VibeColor;
}

interface ChipProps {
  value: number;
  label: string;
  vibeHex: string;
  tooltip: string;
}

function StatChip({ value, label, vibeHex, tooltip }: ChipProps) {
  const isZero = value === 0;
  return (
    <div
      title={tooltip}
      className="flex-1 rounded-2xl border border-brand-50/10 bg-white/[0.025] px-3 py-3.5"
    >
      <div
        className="font-display text-[26px] leading-none"
        style={{ color: isZero ? "rgb(238 246 241 / 0.25)" : vibeHex }}
      >
        {value}
      </div>
      <div
        className={`mt-1 font-figtree text-[10px] font-medium uppercase tracking-[0.14em] ${
          isZero ? "text-brand-50/30" : "text-brand-50/40"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

export default function ProfileStatsRow({ stats, vibe }: ProfileStatsRowProps) {
  return (
    <div className="mb-9 flex gap-2">
      <StatChip
        value={stats.voices}
        label="Voices"
        vibeHex={vibe.hex}
        tooltip="Campfire answers you've shared"
      />
      <StatChip
        value={stats.resonates}
        label="Resonates"
        vibeHex={vibe.hex}
        tooltip="Resonates received on your voices"
      />
      <StatChip
        value={stats.streak}
        label="Night streak"
        vibeHex={vibe.hex}
        tooltip="Days in a row you've shared a voice"
      />
    </div>
  );
}
