const ICON_PROPS = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-full h-full",
};

export function ReceiptIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M8 4h16a1 1 0 0 1 1 1v22l-3-2-3 2-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1Z" />
      <path d="M12 11h8M12 16h8M12 21h5" />
    </svg>
  );
}

export function PaperPlaneIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M28 4 4 14.5l9.5 3.5M28 4 17.5 27.5 13.5 18M28 4 13.5 18" />
    </svg>
  );
}

export function PulseIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M3 17h5l3-9 6 18 3-13 2 4h7" />
    </svg>
  );
}

export function WatcherIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M2 16s5-8 14-8 14 8 14 8-5 8-14 8S2 16 2 16Z" />
      <circle cx="16" cy="16" r="4" />
    </svg>
  );
}

export function WeaveIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="6" y="6" width="20" height="20" rx="3" />
      <path d="M6 12h20M6 20h20M12 6v20M20 6v20" />
      <circle cx="16" cy="16" r="2.5" />
    </svg>
  );
}
