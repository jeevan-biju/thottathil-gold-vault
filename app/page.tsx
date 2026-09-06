"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGRS, useHydrated } from "@/lib/store";

export default function Root() {
  const router = useRouter();
  const phone = useGRS((s) => s.phone);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(phone ? "/dashboard" : "/login");
  }, [hydrated, phone, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-gold-3 border-t-transparent" />
    </div>
  );
}
