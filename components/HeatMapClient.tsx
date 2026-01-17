// components/HeatMapClient.tsx
"use client"; // <- very important!

import dynamic from "next/dynamic";

// Dynamically import the HeatMap component only on the client
const HeatMap = dynamic(() => import("./HeatMap"), {
    ssr: false,
    loading: () => <p className="text-center p-4">Loading Map...</p>
});

import { AuthProvider } from "../context/AuthContext";

export default function HeatMapClient() {
    return (
        <AuthProvider>
            <HeatMap />
        </AuthProvider>
    );
}
