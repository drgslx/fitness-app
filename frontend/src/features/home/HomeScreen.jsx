import HomeFeatures from "./HomeFeatures";
import HomeHero from "./HomeHero";
import React from "react";
import { useAuth } from "../../auth";

export default function HomeScreen() {
  const { user } = useAuth();
  const accountPath = user ? "/profile" : "/login";
  return (
    <main className="w-full max-w-[1600px] overflow-hidden px-4 pb-6 pt-0 md:w-full md:px-6 md:pb-8 md:pt-0 lg:px-10">
      <HomeHero user={user} accountPath={accountPath} />

      <HomeFeatures />
    </main>
  );
}
