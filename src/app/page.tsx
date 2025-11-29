import HomeHeroAuth from "@/components/HomeHeroAuth";
import { redirect } from "next/navigation";

export default function Page() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    redirect("/demo");
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center py-12">
      <h1 className="sr-only">Cabana Management Platform</h1>
      <HomeHeroAuth />
    </main>
  );
}
