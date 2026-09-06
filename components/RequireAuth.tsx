"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGRS, useHydrated } from "@/lib/store";

/** Client-side session gate: no JWT cookie -> back to /login. */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const phone = useGRS((s) => s.phone);
  const hydrated = useHydrated();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !phone) router.replace("/login");
  }, [hydrated, phone, router]);

  if (!hydrated || !phone) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-gold-3 border-t-transparent" />
      </div>
    );
  }
  return <>{children}</>;
}
