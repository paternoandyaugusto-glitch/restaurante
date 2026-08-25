"use client";

import { useMemo, useState } from "react";
import { Armchair, Clock3, Filter, Plus, Sparkles, UsersRound } from "lucide-react";
import type { DiningTable, TableStatus } from "@/lib/types";
import { cn, plural } from "@/lib/utils";
import { useOperations } from "../operations-provider";
import { Button, Card, Modal, PageHeader, StatusBadge } from "../ui";

const statusStyle: Record<TableStatus, { border: string; bar: string; tone: "success" | "warning" | "danger" | "info" | "neutral" | "copper" }> = {
  "Libre": { border: "border-emerald-200 bg-emerald-50/40", bar: "bg-emerald-500", tone: "success" },
  "Ocupada": { border: "border-[#d8c0aa] bg-[#fbf6f0]", bar: "bg-[#b77843]", tone: "copper" },
  "Reservada": { border: "border-sky-200 bg-sky-50/50", bar: "bg-sky-500", tone: "info" },
  "Esperando pedido": { border: "border-amber-300 bg-amber-50/60", bar: "bg-amber-500", tone: "warning" },
  "Pedido enviado": { border: "border-violet-200 bg-violet-50/40", bar: "bg-violet-500", tone: "info" },
  "Comiendo": { border: "border-[#d8c0aa] bg-[#fbf6f0]", bar: "bg-[#9b6037]", tone: "copper" },
  "Esperando cuenta": { border: "border-rose-200 bg-rose-50/50", bar: "bg-rose-500", tone: "danger" },
  "Pagando": { border: "border-fuchsia-200 bg-fuchsia-50/40", bar: "bg-fuchsia-500", tone: "info" },
  "Limpieza": { border: "border-stone-200 bg-stone-100/70", bar: "bg-stone-400", tone: "neutral" },
};

function TableCard({ table, onClick }: { table: DiningTable; onClick: () => void }) {
  const style = statusStyle[table.status];
  return <button onClick={onClick} className={cn("group relative min-h-[178px] overflow-hidden rounded-[22px] border p-4 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg", style.border)}>
    <span className={cn("absolute inset-x-0 top-0 h-1", style.bar)} />
    <div className="flex items-start justify-between"><div><span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Mesa</span><p className="mt-0.5 font-serif text-3xl text-stone-900">{table.number}</p></div><StatusBadge tone={style.tone}>{table.status}</StatusBadge></div>
    <div className="mt-5 flex items-center gap-3 text-[10px] text-stone-500"><span className="flex items-center gap-1"><Armchair size={13} />{table.capacity}</span>{table.guests > 0 && <span className="flex items-center gap-1"><UsersRound size={13} />{table.guests}</span>}{table.elapsed !== undefined && <span className="flex items-center gap-1"><Clock3 size={13} />{table.elapsed} min</span>}</div>
    <div className="mt-4 flex items-end justify-between border-t border-stone-200/60 pt-3"><div>{table.waiter ? <><p className="text-[9px] text-stone-400">Responsable</p><p className="mt-0.5 text-[11px] font-semibold">{table.waiter}</p></> : table.nextReservation ? <><p className="text-[9px] text-stone-400">Próxima reserva</p><p className="mt-0.5 text-[11px] font-semibold">{table.nextReservation}</p></> : <p className="text-[10px] text-stone-400">Disponible ahora</p>}</div>{table.estimate !== undefined && <span className="rounded-lg bg-white/80 px-2 py-1 text-[9px] font-semibold text-stone-500">~{table.estimate} min</span>}</div>
  </button>;
}

export function TablesView() {
  const { tables, updateTableStatus } = useOperations();
  const [area, setArea] = useState("Todas");
  const [selected, setSelected] = useState<DiningTable | null>(null);
  const areas = ["Todas", "Salón", "Ventanal", "Terraza"];
  const filtered = useMemo(() => area === "Todas" ? tables : tables.filter((table) => table.area === area), [area, tables]);
  const selectedLive = selected ? tables.find((table) => table.id === selected.id) ?? selected : null;
  function change(status: TableStatus) { if (!selectedLive) return; updateTableStatus(selectedLive.id, status); setSelected(null); }
  return <div className="space-y-6"><PageHeader eyebrow="Mapa operativo" title="Salón en tiempo real" description="Tocá una mesa para ver su contexto y acceder a la próxima acción." actions={<Button variant="secondary"><Filter size={15} />Filtros</Button>} />
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="scrollbar-none flex gap-1 overflow-x-auto">{areas.map((item) => <button key={item} onClick={() => setArea(item)} className={cn("whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition", area === item ? "bg-[#211a16] text-white" : "text-stone-500 hover:bg-stone-100")}>{item}</button>)}</div><div className="flex flex-wrap items-center gap-3 text-[9px] text-stone-500">{[["Libre", "bg-emerald-500"], ["En servicio", "bg-[#b77843]"], ["Atención", "bg-amber-500"], ["Cuenta", "bg-rose-500"], ["Limpieza", "bg-stone-400"]].map(([label,color]) => <span key={label} className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</span>)}</div></Card>
    <div className="table-grid rounded-[28px] border border-stone-200 bg-[#ece9e3]/60 p-3 sm:p-5"><div className="mb-4 flex items-center justify-between px-2"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-stone-400">{area}</p><p className="mt-1 text-xs text-stone-500">{filtered.length} mesas visibles</p></div><div className="rounded-xl border border-[#d8c2ad] bg-[#f7ede4] px-3 py-2 text-[10px] font-semibold text-[#8b5530]"><Sparkles size={13} className="mr-1.5 inline" />Mesa 12 recomendada para 4</div></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">{filtered.map((table) => <TableCard key={table.id} table={table} onClick={() => setSelected(table)} />)}</div></div>
    <Modal open={!!selectedLive} onClose={() => setSelected(null)} title={selectedLive ? `Mesa ${selectedLive.number}` : "Mesa"} description={selectedLive ? `${selectedLive.area} · ${plural(selectedLive.capacity, "lugar", "lugares")}` : undefined}>{selectedLive && <div><div className="grid grid-cols-3 gap-2"><div className="rounded-2xl bg-stone-100 p-3"><p className="text-[9px] text-stone-400">Estado</p><p className="mt-2 text-xs font-semibold">{selectedLive.status}</p></div><div className="rounded-2xl bg-stone-100 p-3"><p className="text-[9px] text-stone-400">Clientes</p><p className="mt-2 text-xs font-semibold">{selectedLive.guests || "—"}</p></div><div className="rounded-2xl bg-stone-100 p-3"><p className="text-[9px] text-stone-400">Tiempo</p><p className="mt-2 text-xs font-semibold">{selectedLive.elapsed !== undefined ? `${selectedLive.elapsed} min` : "—"}</p></div></div>{selectedLive.features && <div className="mt-4 flex gap-2">{selectedLive.features.map((feature) => <StatusBadge key={feature} tone="copper">{feature}</StatusBadge>)}</div>}<div className="mt-6 grid gap-2 sm:grid-cols-2">{selectedLive.status === "Libre" ? <Button onClick={() => change("Ocupada")}><Plus size={15} />Asignar mesa</Button> : <><Button onClick={() => change(selectedLive.status === "Limpieza" ? "Libre" : "Comiendo")}>{selectedLive.status === "Limpieza" ? "Marcar disponible" : "Actualizar servicio"}</Button><Button variant="secondary" onClick={() => change("Esperando cuenta")}>Solicitar cuenta</Button><Button variant="secondary" onClick={() => change("Limpieza")}>Cerrar y limpiar</Button></>}</div></div>}</Modal>
  </div>;
}
