"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChart,
  IconReceipt,
  IconRupee,
  IconUser,
  IconVault,
} from "./icons";

const items = [
  { href: "/dashboard", label: "Vault", Icon: IconVault },
  { href: "/rates", label: "Rates", Icon: IconChart },
  { href: "/checkout", label: "Pay", Icon: IconRupee, center: true },
  { href: "/passbook", label: "Passbook", Icon: IconReceipt },
  { href: "/account", label: "Account", Icon: IconUser },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md">
      <div className="relative border-t border-white/8 bg-night-1/85 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-xl">
        <div className="grid grid-cols-5">
          {items.map(({ href, label, Icon, ...rest }) => {
            const active = pathname.startsWith(href);
            if ("center" in rest && rest.center) {
              return (
                <div key={href} className="relative flex flex-col items-center justify-end">
                  <Link
                    href={href}
                    aria-label="Pay next installment"
                    className="gold-bg gold-sheen shadow-gold absolute -top-9 flex h-13 w-13 items-center justify-center rounded-[18px] border-4 border-night-0 text-night-0 transition-transform active:scale-92"
                  >
                    <Icon width={24} height={24} strokeWidth={2.1} />
                  </Link>
                  <span className="h-9" />
                  <span
                    className={`pb-1 text-[10px] font-medium tracking-wide ${
                      active ? "text-gold-2" : "text-faint"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 pb-1 pt-1.5"
              >
                <Icon
                  width={22}
                  height={22}
                  className={active ? "text-gold-2" : "text-faint"}
                />
                <span
                  className={`text-[10px] font-medium tracking-wide ${
                    active ? "text-gold-2" : "text-faint"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
