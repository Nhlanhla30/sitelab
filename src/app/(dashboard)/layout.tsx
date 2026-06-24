import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Sidebar from "./_components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileResult = await supabase
    .from("profiles")
    .select("full_name, company_name")
    .eq("id", user.id)
    .single();

  const profile = profileResult.data as {
    full_name: string;
    company_name: string | null;
  } | null;

  const sidebarUser = {
    email: user.email ?? "",
    fullName: profile?.full_name || user.email?.split("@")[0] || "User",
    companyName: profile?.company_name ?? null,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--sl-slate-50)]">
      <Sidebar user={sidebarUser} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
