"use client";

import { useState } from "react";
import { BadgeAlert, ChefHat, Clock3, MoreHorizontal, Plus, Search, Sparkles, UsersRound } from "lucide-react";
import { menuSeed, waitersSeed } from "@/lib/data";
import { cn, money } from "@/lib/utils";
import { Button, Card, PageHeader, StatusBadge } from "../ui";

export function MenuTeamView({ mode }: { mode: "menu" | "team" }) {
  return mode === "menu" ? <MenuView /> : <TeamView />;
}

function MenuView() {
  const [category, setCategory] = useState("Todos");
  const [availability, setAvailability] = useState<Record<number, string>>(() => Object.fromEntries(menuSeed.map((item) => [item.id, item.availability])));
  const categories = ["Todos", ...Array.from(new Set(menuSeed.map((item) => item.category)))];
  const items = category === "Todos" ? menuSeed : menuSeed.filter((item) => item.category === category);
  function toggle(id: number) { setAvailability((current) => ({ ...current, [id]: current[id] === "Disponible" ? "No disponible" : "Disponible" })); }
  return <div className="space-y-6"><PageHeader eyebrow="Carta digital" title="Menú y disponibilidad" description="El estado se refleja en pedidos y en la carta QR de clientes." actions={<Button><Plus size={15} />Nuevo producto</Button>} />
    <Card className="p-3"><div className="flex flex-col gap-3 md:flex-row md:items-center"><div className="relative flex-1"><Search size={15} className="absolute left-3 top-3 text-stone-400" /><input placeholder="Buscar producto" className="h-10 w-full rounded-xl bg-stone-100 pl-9 pr-3 text-xs outline-none" /></div><div className="scrollbar-none flex gap-1 overflow-auto">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={cn("whitespace-nowrap rounded-xl px-3 py-2.5 text-[10px] font-semibold", category === item ? "bg-[#211a16] text-white" : "text-stone-500")}>{item}</button>)}</div></div></Card>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => { const available = availability[item.id] === "Disponible"; return <Card key={item.id} className="overflow-hidden"><div className="flex min-h-[180px]"><div className="flex w-24 shrink-0 items-center justify-center bg-gradient-to-br from-[#3b2b22] to-[#1d1713] font-serif text-4xl text-[#dba16e]">{item.name.charAt(0)}</div><div className="flex min-w-0 flex-1 flex-col p-4"><div className="flex items-start gap-2"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-stone-400">{item.description}</p></div><button className="text-stone-400"><MoreHorizontal size={17} /></button></div><div className="mt-3 flex items-center gap-2"><span className="text-sm font-bold">{money(item.price)}</span><span className="ml-auto flex items-center gap-1 text-[9px] text-stone-400"><Clock3 size={11} />{item.time} min</span></div><div className="mt-auto flex items-center justify-between pt-4"><StatusBadge tone={available ? "success" : "neutral"}>{available ? "Disponible" : "No disponible"}</StatusBadge><button onClick={() => toggle(item.id)} className={`relative h-6 w-11 rounded-full transition ${available ? "bg-emerald-500" : "bg-stone-300"}`} aria-label={`Cambiar disponibilidad de ${item.name}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${available ? "left-6" : "left-1"}`} /></button></div></div></div></Card>})}</div>
  </div>;
}

function TeamView() {
  const recommended = waitersSeed.slice().sort((a,b) => a.score - b.score)[0];
  return <div className="space-y-6"><PageHeader eyebrow="Equipo en servicio" title="Carga de los mozos" description="La recomendación combina mesas, clientes, pedidos activos y alertas." actions={<Button variant="secondary"><UsersRound size={15} />Ver turnos</Button>} />
    <div className="rounded-[22px] border border-[#d8b998] bg-[#f4e7da] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#9c6038] text-white"><Sparkles size={19} /></span><div className="flex-1"><p className="text-sm font-semibold text-[#6d4127]">Asigná la próxima mesa a {recommended.name}</p><p className="mt-1 text-xs text-[#936345]">Tiene la menor carga operativa actual: {recommended.tables} mesa, {recommended.guests} clientes y sin alertas.</p></div><Button className="bg-[#7c4a2d] hover:bg-[#633a22]">Asignar próxima mesa</Button></div></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{waitersSeed.map((waiter) => <Card key={waiter.id} className="p-5"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#241b16] text-xs font-bold text-[#dda16d]">{waiter.initials}</span><StatusBadge tone={waiter.score > 70 ? "danger" : waiter.score > 40 ? "warning" : "success"}>{waiter.score > 70 ? "Carga alta" : waiter.score > 40 ? "Carga media" : "Disponible"}</StatusBadge></div><h3 className="mt-5 text-sm font-semibold">{waiter.name}</h3><p className="mt-1 text-[10px] text-stone-400">Turno {waiter.shift}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-100"><div style={{ width: `${waiter.score}%` }} className={`h-full rounded-full ${waiter.score > 70 ? "bg-rose-500" : waiter.score > 40 ? "bg-amber-500" : "bg-emerald-500"}`} /></div><div className="mt-5 grid grid-cols-2 gap-2">{[["Mesas", waiter.tables], ["Clientes", waiter.guests], ["Pedidos", waiter.activeOrders], ["Alertas", waiter.alerts]].map(([label,value]) => <div key={String(label)} className="rounded-xl bg-stone-50 p-3"><p className="text-base font-semibold">{value}</p><p className="mt-1 text-[9px] text-stone-400">{label}</p></div>)}</div>{waiter.alerts > 0 && <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-[10px] font-semibold text-rose-700"><BadgeAlert size={13} />{waiter.alerts} mesa{waiter.alerts > 1 ? "s" : ""} requiere atención</div>}</Card>)}</div>
    <Card className="p-5"><div className="flex items-center gap-3"><ChefHat className="text-[#9b6037]" /><div><p className="text-sm font-semibold">Criterio de carga transparente</p><p className="mt-1 text-[10px] text-stone-500">Mesas 25% · clientes 25% · pedidos 30% · alertas 20%. Recepción siempre puede ajustar la asignación.</p></div></div></Card>
  </div>;
}
