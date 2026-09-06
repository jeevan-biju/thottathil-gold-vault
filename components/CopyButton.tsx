"use client";

import { useState } from "react";
import { IconCheck, IconCopy } from "./icons";

export default function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all active:scale-95 ${
        copied
          ? "border-mint/40 bg-mint/10 text-mint"
          : "border-gold-3/30 bg-gold-3/10 text-gold-2"
      }`}
    >
      {copied ? <IconCheck width={13} height={13} /> : <IconCopy width={13} height={13} />}
      {copied ? "Copied" : label ?? "Copy"}
    </button>
  );
}
