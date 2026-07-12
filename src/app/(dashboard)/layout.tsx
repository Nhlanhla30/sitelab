import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
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
  if (!user) redirect("/login");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("full_name, company_name")
    .eq("id", user.id)
    .single()) as {
    data: { full_name: string | null; company_name: string | null } | null;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 256,
          zIndex: 40,
        }}
      >
        <Sidebar
          fullName={profile?.full_name ?? user.email ?? ""}
          companyName={profile?.company_name ?? ""}
        />
      </div>
      <main
        style={{
          marginLeft: 256,
          width: "calc(100% - 256px)",
          minHeight: "100vh",
          padding: 32,
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </div>
  );
}
