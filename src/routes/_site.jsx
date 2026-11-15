import { createFileRoute, Outlet } from "@tanstack/react-router";
import SpaceBackground from "@/components/SpaceBackground";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SpaceBackground />
      <SiteHeader />
      <main className="relative z-10 pt-16">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}