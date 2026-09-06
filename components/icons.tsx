import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const IconVault = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 9.5 12 4l8.5 5.5" />
    <path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9" />
    <path d="M3.5 19h17" />
  </svg>
);

export const IconChart = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" strokeOpacity="0" />
    <path d="M3 17l5.5-5.5 4 3L21 6" />
    <path d="M15.5 6H21v5.5" />
  </svg>
);

export const IconReceipt = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z" />
    <path d="M9.5 8h5M9.5 12h5" />
  </svg>
);

export const IconUser = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.4-3.6 4.2-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
  </svg>
);

export const IconBell = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.4 5.4 2 6H4c.6-.6 2-2 2-6Z" />
    <path d="M10 19a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const IconChevronLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </svg>
);

export const IconChevronRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M9.5 5.5 16 12l-6.5 6.5" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15H4.5A2.5 2.5 0 0 1 2 12.5v-8A2.5 2.5 0 0 1 4.5 2h8A2.5 2.5 0 0 1 15 4.5V5" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconArrowUp = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 15 12 9l6 6" />
  </svg>
);

export const IconTrendUp = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

export const IconDownload = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v11M7.5 11 12 15.5 16.5 11" />
    <path d="M4 20h16" />
  </svg>
);

export const IconLock = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 5 5.8v5.4c0 4.3 2.9 7.6 7 9.8 4.1-2.2 7-5.5 7-9.8V5.8L12 3Z" />
    <path d="m9 11.5 2.2 2.2L15.5 9.5" />
  </svg>
);

export const IconSparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3c.7 4.5 2.5 6.3 7 7-4.5.7-6.3 2.5-7 7-.7-4.5-2.5-6.3-7-7 4.5-.7 6.3-2.5 7-7Z" />
    <path d="M19 15c.3 2 1.1 2.8 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.2 2.7-1 3-3Z" strokeWidth="1.4" />
  </svg>
);

export const IconBank = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 9.5 12 4l9 5.5" />
    <path d="M4.5 10v8M9 10v8M15 10v8M19.5 10v8" />
    <path d="M3 18.5h18M3 21.5h18" strokeOpacity="0.55" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconRupee = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 4h12M6 8.5h12M6 4c6 0 8 1.7 8 4.5S12 13 8 13H6l7 7" />
  </svg>
);

export const IconLogout = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
    <path d="M17 8l4 4-4 4M21 12H10" />
  </svg>
);

export const IconFile = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 3h7l4 4v14H7V3Z" />
    <path d="M14 3v4h4M10 12h5M10 16h5" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3Z" />
    <path d="M10.5 17.5h3" />
  </svg>
);

export const IconInfo = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 7.8v.2" />
  </svg>
);

/** Brand mark — three stacked gold bars */
export const LogoBars = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F9E7A8" />
        <stop offset="0.5" stopColor="#EAC85F" />
        <stop offset="1" stopColor="#B4841F" />
      </linearGradient>
    </defs>
    <path d="M19 13 23 8h2l4 5H19Z" fill="url(#lg1)" />
    <path d="M13 23 18 16h12l5 7H13Z" fill="url(#lg1)" />
    <path d="M7 33 13 25h22l6 8H7Z" fill="url(#lg1)" opacity="0.92" />
    <path d="M3 41 10 34h28l7 7H3Z" fill="url(#lg1)" opacity="0.8" />
  </svg>
);
