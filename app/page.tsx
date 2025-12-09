import dynamic from "next/dynamic";

// Dynamically import HeatMap with SSR disabled
const HeatMap = dynamic(() => import("../components/HeatMap"), {
  ssr: false, // <- prevents "window is not defined" error
});

export default function Home() {
  return <HeatMap />;
}
