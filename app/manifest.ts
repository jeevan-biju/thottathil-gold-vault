import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Thottathil Gold Vault — GRS",
    short_name: "TFJ Vault",
    description:
      "Thottathil Fashion Jewellery Gold Recurring Savings. Pay monthly, accumulate 22K gold gram by gram.",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#04070e",
    theme_color: "#04070e",
    categories: ["finance", "shopping"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
