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
    <>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {clients.length === 0
              ? "No clients yet"
              : `${clients.length} ${clients.length === 1 ? "client" : "clients"}`}
          </p>
        </div>
        <AddClientModal userId={user.id} />
      </div>

      {clients.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Users size={24} className="text-slate-400" aria-hidden />
          </div>
          <h3 className="mb-1 text-sm font-semibold text-slate-900">
            No clients yet
          </h3>
          <p className="mb-5 text-sm text-slate-500">
            Add your first client to start creating quotes.
          </p>
          <AddClientModal userId={user.id} />
        </div>
      ) : (
        /* Table */
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {["Name", "Contact person", "Email", "Phone"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Quotes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {client.name}
                      </p>
                      {(client.city || client.province) && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {[client.city, client.province]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {client.contact_person}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {client.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {client.phone}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {quoteCountByClient[client.id] ?? 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
