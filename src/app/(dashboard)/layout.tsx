import { AppStoreProvider } from "@/context/app-store";
import { AppShell } from "@/components/layout/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppStoreProvider>
      <TooltipProvider delayDuration={200}>
        <AppShell>{children}</AppShell>
      </TooltipProvider>
    </AppStoreProvider>
  );
}
