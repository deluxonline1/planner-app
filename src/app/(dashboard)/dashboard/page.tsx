import { redirect } from "next/navigation";

import { DashboardView } from "@/components/dashboard/dashboard-view";

import { createClient } from "@supabase/supabase-js";

export default async function DashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardView />;
}