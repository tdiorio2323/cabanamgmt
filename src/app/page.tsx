import HomeHeroAuth from "@/components/HomeHeroAuth";

export default function Page() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center py-12">
      <h1 className="sr-only">Cabana Management Platform</h1>
      <HomeHeroAuth />
    </main>
  );
}
