// components/HeatMapClient.tsx
"use client"; // <- important, makes this a Client Component

import dynamic from "next/dynamic";

// Dynamically import HeatMap, client-only
const HeatMap = dynamic(() => import("./HeatMap"), { ssr: false });

export default function HeatMapClient() {
  return <HeatMap />;
}
