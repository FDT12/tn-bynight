// components/HeatMapClient.tsx
"use client"; // <- very important!

import dynamic from "next/dynamic";

// Dynamically import the HeatMap component only on the client
const HeatMap = dynamic(() => import("./HeatMap"), { ssr: false });

export default function HeatMapClient() {
  return <HeatMap />;
}
