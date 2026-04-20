type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="60" height="60" rx="18" fill="currentColor" />
      <path
        d="M19 44V20h7.4l6.2 11.8L39 20H46v24h-6.3V31.8l-5.2 9.8h-3.7l-5.2-9.8V44H19Z"
        fill="hsl(var(--background))"
      />
    </svg>
  );
}
