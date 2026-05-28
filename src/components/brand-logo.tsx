import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  title?: string;
};

/**
 * Spare Hub mark — geometric 8-tooth gear with a sprout rising from its center.
 * Single-color: every shape inherits `currentColor`, so the mark flips
 * with theme via `text-primary`, `text-foreground`, etc. No hardcoded hex.
 */
export function BrandLogo({ className, title = "Spare Hub" }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn("h-8 w-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <defs>
        <mask id="sh-sprout-cut" maskUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="white" />
          {/* Cut a clean disc out of the gear center so the sprout sits in negative space */}
          <circle cx="32" cy="32" r="14" fill="black" />
        </mask>
      </defs>

      {/* Gear ring: 8 teeth + body, with center disc cut out */}
      <g mask="url(#sh-sprout-cut)" fill="currentColor">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="28"
            y="2"
            width="8"
            height="10"
            rx="1.25"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="22" />
      </g>

      {/* Sprout inside the gear — vertical stem with two symmetric leaves */}
      <g fill="currentColor">
        {/* Stem */}
        <rect x="31" y="30" width="2" height="12" rx="1" />
        {/* Left leaf */}
        <path d="M31 30 C 26 30 23 27 23 23 C 27 23 30 25 31 30 Z" />
        {/* Right leaf */}
        <path d="M33 30 C 38 30 41 27 41 23 C 37 23 34 25 33 30 Z" />
      </g>
    </svg>
  );
}

export default BrandLogo;
