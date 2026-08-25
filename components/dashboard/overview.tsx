"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChefHat, Clock3, CircleDollarSign, TriangleAlert, UsersRound, UtensilsCrossed } from "lucide-react";
import { chartData, waitersSeed } from "@/lib/data";
import { useOperations } from "../operations-provider";
import { Card, KpiCard, PageHeader, SectionTitle, StatusBadge } from "../ui";

export function Overview() {
  const { tables, orders, waitlist } = useOperations();
  const occupied = tables.filter((table) => !["Libre", "Reservada", "Limpieza"].includes(table.status)).length;
  const guests = tables.reduce((sum, table) => sum + table.guests, 0);
  const activeOrders = orders.filter((order) => order.status !== "ENTREGADO").length;
  const alerts = [
    { title: "Pedido K-184 demorado", detail: "Mesa 4 · 22 min en preparación", tone: "danger" as const, time: "Ahora" },
    { title: "Mesa 3 espera atención", detail: "4 clientes · 7 min sin pedido", tone: "warning" as const, time: "Hace 1 min" },
    { title: "Mozzarella con stock bajo", detail: "Quedan 3,2 kg · mínimo 5 kg", tone: "copper" as const, time: "Hace 8 min" },
  ];
  return <div className="space-y-7">
    <PageHeader eyebrow="Martes, 25 de agosto · 20:44" title="Buenas noches, Andrés." description="El salón está en su pico de ocupación. Hay 3 situaciones que requieren atención." actions={<><button className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-semibold text-stone-600">Turno noche</button><Link href="/dashboard/tables" className="rounded-xl bg-[#211a16] px-4 py-2.5 text-xs font-semibold text-white">Ver salón</Link></>} />
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <KpiCard label="Ocupación del salón" value={`${Math.round((occupied / tables.length) * 100)}%`} hint="+8% vs. 20:00" icon={<UtensilsCrossed size={19} />} accent />
      <KpiCard label="Clientes en el local" value={String(guests)} hint="12 ingresaron" icon={<UsersRound size={19} />} />
      <KpiCard label="Pedidos activos" value={String(activeOrders)} hint="3 en tiempo" icon={<ChefHat size={19} />} />
      <KpiCard label="Ventas del día" value="$4,8 M" hint="+12,4%" icon={<CircleDollarSign size={19} />} />
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.45fr_.85fr]">
      <Card className="p-5 md:p-6"><SectionTitle title="Ritmo del servicio" detail="Clientes atendidos por franja de 15 minutos" action={<span className="rounded-full bg-stone-100 px-3 py-1.5 text-[10px] font-semibold text-stone-500">18:00 — ahora</span>} />
        <div className="mt-8 flex h-48 items-end gap-2 md:h-56 md:gap-3">{chartData.map((value, index) => <div key={index} className="group flex h-full flex-1 flex-col justify-end"><motion.div initial={{ height: 0 }} animate={{ height: `${value}%` }} transition={{ delay: index * .035, duration: .5 }} className={`relative min-h-2 rounded-t-md transition ${index === 9 ? "bg-[#a9673b]" : index > 8 ? "bg-[#d4aa87]" : "bg-[#ece3db] group-hover:bg-[#dfc9b6]"}`}><span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-stone-900 px-1.5 py-1 text-[8px] text-white group-hover:block">{value}</span></motion.div><span className="mt-2 hidden text-center text-[8px] text-stone-400 sm:block">{18 + Math.floor(index / 3)}:{String((index % 3) * 15).padStart(2, "0")}</span></div>)}</div>
        <div className="mt-4 flex flex-wrap gap-5 border-t border-stone-100 pt-4"><div><p className="text-[10px] text-stone-400">Promedio de mesa</p><p className="mt-1 text-sm font-semibold">1 h 18 min</p></div><div><p className="text-[10px] text-stone-400">Espera promedio</p><p className="mt-1 text-sm font-semibold">18 min</p></div><div><p className="text-[10px] text-stone-400">Cocina promedio</p><p className="mt-1 text-sm font-semibold">16 min</p></div><div className="ml-auto"><StatusBadge tone="success">Dentro del objetivo</StatusBadge></div></div>
      </Card>
      <Card className="p-5 md:p-6"><SectionTitle title="Atención requerida" detail={`${alerts.length} alertas activas`} action={<TriangleAlert size={18} className="text-amber-600" />} /><div className="mt-5 space-y-2.5">{alerts.map((alert, index) => <motion.div key={alert.title} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2 + index * .07 }} className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3.5"><div className="flex items-start gap-3"><StatusBadge tone={alert.tone} dot className="mt-0.5 px-1.5 py-1"><span className="sr-only">Alerta</span></StatusBadge><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-stone-800">{alert.title}</p><p className="mt-1 text-[10px] leading-4 text-stone-500">{alert.detail}</p></div><span className="text-[9px] text-stone-400">{alert.time}</span></div></motion.div>)}</div><Link href="/dashboard/kitchen" className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-stone-200 py-2.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50">Resolver alertas <ArrowUpRight size={13} /></Link></Card>
    </div>

    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <Card className="p-5 md:p-6"><SectionTitle title="Estado del salón" detail="12 mesas · actualización instantánea" action={<Link href="/dashboard/tables" className="text-xs font-semibold text-[#94582f]">Abrir mapa →</Link>} /><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{[
        ["Libres", tables.filter(t => t.status === "Libre").length, "bg-emerald-500"],
        ["Ocupadas", occupied, "bg-[#b77843]"],
        ["Reservadas", tables.filter(t => t.status === "Reservada").length, "bg-sky-500"],
        ["Limpieza", tables.filter(t => t.status === "Limpieza").length, "bg-stone-400"],
      ].map(([label, value, color]) => <div key={String(label)} className="rounded-2xl bg-stone-50 p-4"><span className={`block h-2 w-2 rounded-full ${color}`} /><p className="mt-4 text-2xl font-semibold">{value}</p><p className="mt-1 text-[10px] text-stone-500">{label}</p></div>)}</div><div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f3e8de] p-4"><Clock3 size={20} className="text-[#9b6037]" /><div><p className="text-xs font-semibold">Próxima mesa disponible: Mesa 9</p><p className="mt-0.5 text-[10px] text-stone-500">Limpieza · estimada en 4 minutos</p></div><StatusBadge tone="copper" className="ml-auto">4 min</StatusBadge></div></Card>
      <Card className="p-5 md:p-6"><SectionTitle title="Carga del equipo" detail="Recomendación para la próxima mesa" /><div className="mt-5 space-y-3">{waitersSeed.slice().sort((a,b) => a.score-b.score).slice(0,3).map((waiter, index) => <div key={waiter.name} className={`rounded-2xl border p-3.5 ${index === 0 ? "border-[#d7b696] bg-[#fbf4ed]" : "border-stone-100"}`}><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2b211b] text-[10px] font-bold text-[#dda26e]">{waiter.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><p className="text-xs font-semibold">{waiter.name}</p><span className="text-[10px] font-semibold text-stone-500">{waiter.score}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100"><div style={{ width: `${waiter.score}%` }} className={`h-full rounded-full ${waiter.score > 70 ? "bg-rose-500" : "bg-[#b77843]"}`} /></div><p className="mt-1.5 text-[9px] text-stone-400">{waiter.tables} mesas · {waiter.guests} clientes</p></div></div>{index === 0 && <p className="mt-3 border-t border-[#ead7c5] pt-2 text-[10px] font-semibold text-[#8e542d]">Recomendado para la próxima mesa</p>}</div>)}</div></Card>
    </div>
    {waitlist.length > 0 && <div className="rounded-2xl border border-[#dbc1a7] bg-[#f4e8dc] p-4 text-sm text-[#70462b]"><strong>Lista de espera:</strong> {waitlist.length} grupos · Mesa 12 es compatible con el grupo Fernández.</div>}
  </div>;
}
