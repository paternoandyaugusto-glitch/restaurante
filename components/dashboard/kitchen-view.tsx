"use client";

import { BellRing, Check, ChefHat, Clock3, Flame, Volume2 } from "lucide-react";
import type { KitchenOrder, KitchenStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useOperations } from "../operations-provider";
import { Button, PageHeader } from "../ui";

const columns: { status: KitchenStatus; label: string; dot: string }[] = [
  { status: "RECIBIDO", label: "Recibidos", dot: "bg-sky-500" },
  { status: "PREPARANDO", label: "En preparación", dot: "bg-amber-500" },
  { status: "LISTO", label: "Listos", dot: "bg-emerald-500" },
];

function Ticket({ order, advance }: { order: KitchenOrder; advance: () => void }) {
  const late = order.elapsed >= 20;
  const button = order.status === "RECIBIDO" ? "Comenzar preparación" : order.status === "PREPARANDO" ? "Marcar como listo" : "Marcar entregado";
  return <article className={cn("overflow-hidden rounded-[20px] border bg-white shadow-sm", late ? "border-rose-300 ring-2 ring-rose-100" : "border-stone-200")}>
    <div className={cn("h-1", order.status === "RECIBIDO" ? "bg-sky-500" : order.status === "PREPARANDO" ? "bg-amber-500" : "bg-emerald-500")} />
    <div className="p-4"><div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.17em] text-stone-400">{order.id}</p><h3 className="mt-1 font-serif text-2xl">Mesa {order.table}</h3><p className="mt-1 text-[10px] text-stone-400">{order.waiter} · {order.receivedAt}</p></div><div className={cn("rounded-xl px-3 py-2 text-center", late ? "bg-rose-50 text-rose-700" : "bg-stone-100 text-stone-600")}><Clock3 size={14} className="mx-auto" /><p className="mt-1 text-[11px] font-bold">{order.elapsed} min</p></div></div>
      {late && <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-[10px] font-semibold text-rose-700"><Flame size={13} />Demorado · priorizar</div>}
      <div className="my-4 h-px bg-stone-100" /><div className="space-y-3">{order.items.map((item, index) => <div key={`${item.name}-${index}`} className="flex gap-3"><span className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-[#2a201a] text-[10px] font-bold text-white">{item.quantity}</span><div><p className="text-xs font-semibold leading-5">{item.name}</p>{item.modifications?.map((modifier) => <p key={modifier} className="mt-0.5 text-[10px] font-medium text-[#9a5a32]">• {modifier}</p>)}</div></div>)}</div>
      {order.note && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] font-semibold leading-4 text-amber-800">Nota: {order.note}</div>}
      <Button onClick={advance} className={cn("mt-5 w-full", order.status === "LISTO" && "bg-emerald-700 hover:bg-emerald-800")}>{order.status === "LISTO" && <Check size={15} />}{button}</Button>
    </div>
  </article>;
}

export function KitchenView() {
  const { orders, advanceOrder } = useOperations();
  const active = orders.filter((order) => order.status !== "ENTREGADO");
  return <div className="space-y-6"><PageHeader eyebrow="Kitchen Display System" title="Pase de cocina" description="Los pedidos más antiguos aparecen primero. Un toque avanza cada ticket." actions={<><span className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700"><BellRing size={15} />Notificaciones activas</span><Button variant="secondary"><Volume2 size={15} />Sonido</Button></>} />
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><div className="rounded-2xl bg-[#241b16] p-4 text-white"><ChefHat size={18} className="text-[#dba16e]" /><p className="mt-4 text-2xl font-semibold">{active.length}</p><p className="mt-1 text-[10px] text-stone-400">Tickets activos</p></div><div className="rounded-2xl border border-stone-200 bg-white p-4"><Clock3 size={18} className="text-[#9b6037]" /><p className="mt-4 text-2xl font-semibold">16 min</p><p className="mt-1 text-[10px] text-stone-400">Tiempo promedio</p></div><div className="rounded-2xl border border-rose-200 bg-rose-50 p-4"><Flame size={18} className="text-rose-600" /><p className="mt-4 text-2xl font-semibold text-rose-700">{active.filter((order) => order.elapsed >= 20).length}</p><p className="mt-1 text-[10px] text-rose-600">Pedidos demorados</p></div><div className="rounded-2xl border border-stone-200 bg-white p-4"><Check size={18} className="text-emerald-600" /><p className="mt-4 text-2xl font-semibold">42</p><p className="mt-1 text-[10px] text-stone-400">Entregados hoy</p></div></div>
    <div className="grid gap-4 xl:grid-cols-3">{columns.map((column) => { const list = active.filter((order) => order.status === column.status).sort((a,b) => b.elapsed-a.elapsed); return <section key={column.status} className="min-h-[420px] rounded-[24px] bg-stone-200/55 p-3"><div className="mb-3 flex items-center gap-2 px-2 py-1"><span className={cn("h-2.5 w-2.5 rounded-full", column.dot)} /><h2 className="text-xs font-bold uppercase tracking-[.12em] text-stone-600">{column.label}</h2><span className="ml-auto rounded-full bg-white px-2 py-1 text-[10px] font-bold text-stone-500">{list.length}</span></div><div className="space-y-3">{list.map((order) => <Ticket key={order.id} order={order} advance={() => advanceOrder(order.id)} />)}{list.length === 0 && <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-stone-300 text-xs text-stone-400">Sin pedidos en esta etapa</div>}</div></section>; })}</div>
  </div>;
}
