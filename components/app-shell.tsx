"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell, CalendarDays, ChevronDown, CircleDollarSign, ClipboardList, CookingPot,
  LayoutDashboard, Menu, MenuSquare, Search, Settings,
  Sparkles, TableProperties, UsersRound, UserRound, X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useOperations } from "./operations-provider";
import { ToastStack } from "./ui";

const nav = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/tables", label: "Mesas", icon: TableProperties },
  { href: "/dashboard/orders", label: "Pedidos", icon: ClipboardList },
  { href: "/dashboard/kitchen", label: "Cocina", icon: CookingPot, count: 5 },
  { href: "/dashboard/reservations", label: "Reservas", icon: CalendarDays },
  { href: "/dashboard/waitlist", label: "Lista de espera", icon: UsersRound, count: 3 },
  { href: "/dashboard/billing", label: "Cuentas", icon: CircleDollarSign },
  { href: "/dashboard/menu", label: "Menú", icon: MenuSquare },
  { href: "/dashboard/team", label: "Personal", icon: UserRound },
];

function Brand() {
  return <Link href="/dashboard" className="group flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.06] font-serif text-xl text-[#dca16e] transition group-hover:bg-white/10">K</div>
    <div><p className="font-serif text-lg tracking-[.08em] text-white">KANSAS</p><p className="text-[8px] uppercase tracking-[.26em] text-stone-500">Operations</p></div>
  </Link>;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <>
    <div className="px-5 pb-7 pt-5"><Brand /></div>
    <nav className="flex-1 space-y-1 px-3" aria-label="Navegación principal">
      <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[.2em] text-stone-600">Operación</p>
      {nav.map(({ href, label, icon: Icon, count }) => {
        const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} onClick={onNavigate} className={cn("group relative flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition", active ? "bg-white/[.09] text-white" : "text-stone-400 hover:bg-white/[.05] hover:text-stone-200")}>
          {active && <motion.span layoutId="nav-indicator" className="absolute left-0 h-5 w-[3px] rounded-r-full bg-[#d08e55]" />}
          <Icon size={18} strokeWidth={1.8} className={active ? "text-[#dca16e]" : "text-stone-500 group-hover:text-stone-300"} />
          <span className="flex-1">{label}</span>
          {count && <span className={cn("min-w-5 rounded-full px-1.5 py-0.5 text-center text-[9px]", active ? "bg-[#d08e55] text-white" : "bg-white/10 text-stone-400")}>{count}</span>}
        </Link>;
      })}
    </nav>
    <div className="px-3 pb-4">
      <Link href="/dashboard/settings" onClick={onNavigate} className="flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-stone-400 transition hover:bg-white/[.05] hover:text-white"><Settings size={18} />Configuración</Link>
      <div className="mt-3 rounded-2xl border border-white/[.07] bg-white/[.035] p-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-300"><Sparkles size={14} className="text-[#dca16e]" /> Servicio en vivo</div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: .8 }} className="h-full rounded-full bg-gradient-to-r from-[#a6673b] to-[#e2a66f]" /></div>
        <p className="mt-2 text-[10px] text-stone-500">78% de ocupación · Palermo</p>
      </div>
    </div>
  </>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toasts, dismissToast } = useOperations();
  return <div className="min-h-screen bg-[#f6f4f0] text-stone-900">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[244px] flex-col bg-[#181411] lg:flex"><SidebarContent /></aside>
    <AnimatePresence>{mobileOpen && <>
      <motion.button aria-label="Cerrar menú" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden" />
      <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-y-0 left-0 z-50 flex w-[284px] flex-col bg-[#181411] lg:hidden"><button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 text-stone-500 hover:bg-white/5 hover:text-white"><X size={18} /></button><SidebarContent onNavigate={() => setMobileOpen(false)} /></motion.aside>
    </>}</AnimatePresence>

    <div className="lg:pl-[244px]">
      <header className="sticky top-0 z-30 flex h-[68px] items-center border-b border-stone-200/80 bg-[#f6f4f0]/90 px-4 backdrop-blur-xl md:px-7">
        <button aria-label="Abrir navegación" onClick={() => setMobileOpen(true)} className="mr-3 rounded-xl border border-stone-200 bg-white p-2 text-stone-600 lg:hidden"><Menu size={19} /></button>
        <div className="hidden items-center gap-3 md:flex"><div className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500"><Search size={17} /></div><div><p className="text-[10px] uppercase tracking-[.14em] text-stone-400">Local</p><button className="flex items-center gap-1 text-sm font-semibold text-stone-800">Palermo <ChevronDown size={13} /></button></div></div>
        <div className="ml-auto flex items-center gap-2">
          <div className="mr-1 hidden items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700 sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />En tiempo real</div>
          <button aria-label="Ver notificaciones" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#b77843]" /></button>
          <button className="flex h-10 items-center gap-2 rounded-xl border border-stone-200 bg-white px-2 pr-3"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3a2a21] text-[10px] font-bold text-[#e2aa77]">AP</span><span className="hidden text-left sm:block"><span className="block text-xs font-semibold">Andrés</span><span className="block text-[9px] text-stone-400">Administrador</span></span><ChevronDown size={13} className="text-stone-400" /></button>
        </div>
      </header>
      <motion.main key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto min-h-[calc(100vh-68px)] max-w-[1600px] p-4 md:p-7 lg:p-8">{children}</motion.main>
    </div>
    <ToastStack toasts={toasts} dismiss={dismissToast} />
  </div>;
}
