import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Sidebar from "./_components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile }: { data: { full_name: string | null; company_name: string | null } | null } = await supabase
    .from("profiles")
    .select("full_name, company_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        fullName={profile?.full_name ?? user.email ?? ""}
        companyName={profile?.company_name ?? ""}
      />
      <main style={{ marginLeft: '256px', minHeight: '100vh', padding: '32px' }}>
        {children}
      </main>
    </div>
  );
}
