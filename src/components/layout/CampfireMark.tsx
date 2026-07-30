/**
 * The brand mark: a small campfire — ember flame over crossed logs,
 * with a soft glow. Size it with className (h-9 w-9 etc.).
 */
export default function CampfireMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cfm-glow" cx="50%" cy="58%" r="50%">
          <stop offset="0%" stopColor="#f5d28b" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#e8b86a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#e8b86a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cfm-flame" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#C99845" />
          <stop offset="0.6" stopColor="#E8B86A" />
          <stop offset="1" stopColor="#F5D28B" />
        </linearGradient>
      </defs>

      {/* Firelight */}
      <circle cx="16" cy="17" r="14" fill="url(#cfm-glow)" />

      {/* Flame */}
      <path
        d="M16 4.5 C13 8.5 10.8 10.6 10.8 15.2 a5.2 5.2 0 0 0 10.4 0 C21.2 12.4 19.8 10.7 18.3 9 C18.3 11.6 17.1 12.4 16.1 12.4 C16.1 9.4 16.6 7 16 4.5 Z"
        fill="url(#cfm-flame)"
      />
      {/* Inner flame */}
      <path
        d="M16 12.6 C14.7 14.4 13.9 15.3 13.9 17.1 a2.1 2.1 0 0 0 4.2 0 C18.1 15.7 17.2 14.5 16 12.6 Z"
        fill="#F5D28B"
        opacity="0.9"
      />

      {/* Crossed logs */}
      <rect
        x="8.2"
        y="23.4"
        width="15.6"
        height="2.7"
        rx="1.35"
        fill="#8A6435"
        transform="rotate(9 16 24.75)"
      />
      <rect
        x="8.2"
        y="23.4"
        width="15.6"
        height="2.7"
        rx="1.35"
        fill="#A87F49"
        transform="rotate(-9 16 24.75)"
      />
    </svg>
  );
}
