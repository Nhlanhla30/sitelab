import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";
import AddClientModal from "./_components/add-client-modal";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [clientsResult, quotesResult] = await Promise.all([
    supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
    supabase.from("quotes").select("client_id").eq("user_id", user.id),
  ]);

  const clients = (clientsResult.data ?? []) as ClientRow[];
  const quoteCountByClient = (
    (quotesResult.data ?? []) as { client_id: string }[]
  ).reduce(
    (acc, q) => {
      acc[q.client_id] = (acc[q.client_id] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Clients
          </h1>
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            {clients.length === 0
              ? "No clients yet"
              : `${clients.length} ${clients.length === 1 ? "client" : "clients"}`}
          </p>
        </div>
        <AddClientModal userId={user.id} />
      </div>

      {clients.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sl-slate-100)]">
            <Users size={24} className="text-[var(--sl-slate-400)]" aria-hidden />
          </div>
          <h3 className="mb-1 text-sm font-semibold text-[var(--foreground)]">
            No clients yet
          </h3>
          <p className="mb-5 text-sm text-[var(--muted-foreground)]">
            Add your first client to start creating quotes.
          </p>
          <AddClientModal userId={user.id} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--sl-slate-50)]">
                {["Name", "Contact person", "Email", "Phone"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  Quotes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="transition-colors hover:bg-[var(--sl-slate-50)]"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-[var(--foreground)]">
                      {client.name}
                    </p>
                    {(client.city || client.province) && (
                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        {[client.city, client.province].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {client.contact_person}
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                    {client.email}
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                    {client.phone}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center justify-center rounded-full bg-[var(--sl-slate-100)] px-2.5 py-0.5 text-xs font-semibold text-[var(--sl-slate-600)]">
                      {quoteCountByClient[client.id] ?? 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
