"use client";
import dynamic from "next/dynamic";
import { LookupProvider } from "./context/LookupContext";

const Lookup = dynamic(() => import("@components/Lookup"), {
  ssr: false,
  loading: () => (
    <div className="text-xl text-green-600 p-4">
      Loading...
    </div>
  ),
});

const Home = () => {
  return (
    <LookupProvider>
      <Lookup />
    </LookupProvider>
  );
};

export default Home;
