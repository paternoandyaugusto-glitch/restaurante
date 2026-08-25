"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatusBadge({ children, tone = "neutral", dot = true, className }: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "info" | "neutral" | "copper";
  dot?: boolean;
  className?: string;
}) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-800 ring-amber-200",
    danger: "bg-rose-50 text-rose-700 ring-rose-200",
    info: "bg-sky-50 text-sky-700 ring-sky-200",
    neutral: "bg-stone-100 text-stone-600 ring-stone-200",
    copper: "bg-[#f3e9df] text-[#8f542c] ring-[#e7cfb8]",
  };
  const dots = { success: "bg-emerald-500", warning: "bg-amber-500", danger: "bg-rose-500", info: "bg-sky-500", neutral: "bg-stone-400", copper: "bg-[#b77843]" };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset", tones[tone], className)}>
    {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dots[tone])} />}{children}
  </span>;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      {eyebrow && <p className="mb-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#9b6037]">{eyebrow}</p>}
      <h1 className="font-serif text-3xl tracking-[-.04em] text-[#211b17] md:text-[38px]">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>;
}

export function Button({ children, variant = "primary", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  const variants = {
    primary: "bg-[#211a16] text-white shadow-sm hover:bg-[#3a2b22]",
    secondary: "border border-stone-200 bg-white text-stone-700 shadow-sm hover:border-stone-300 hover:bg-stone-50",
    ghost: "text-stone-600 hover:bg-stone-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return <button className={cn("inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-45", variants[variant], className)} {...props}>{children}</button>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[22px] border border-stone-200/80 bg-white shadow-[0_1px_2px_rgba(31,23,18,.03)]", className)}>{children}</div>;
}

export function KpiCard({ label, value, hint, icon, accent = false }: { label: string; value: string; hint: string; icon: ReactNode; accent?: boolean }) {
  return <motion.div whileHover={{ y: -3 }} transition={{ duration: .18 }} className={cn("relative overflow-hidden rounded-[22px] border p-5", accent ? "border-[#453328] bg-[#241b16] text-white shadow-glow" : "border-stone-200/80 bg-white")}>
    <div className="flex items-start justify-between">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accent ? "bg-white/10 text-[#dca16e]" : "bg-[#f3ece4] text-[#9b6037]")}>{icon}</div>
      <span className={cn("rounded-full px-2 py-1 text-[10px] font-semibold", accent ? "bg-emerald-400/15 text-emerald-300" : "bg-emerald-50 text-emerald-700")}>{hint}</span>
    </div>
    <p className={cn("mt-5 text-xs font-medium", accent ? "text-stone-400" : "text-stone-500")}>{label}</p>
    <p className="mt-1 text-[30px] font-semibold tracking-[-.04em]">{value}</p>
  </motion.div>;
}

export function SectionTitle({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return <div className="flex items-center justify-between gap-4">
    <div><h2 className="text-base font-semibold tracking-tight text-stone-900">{title}</h2>{detail && <p className="mt-1 text-xs text-stone-500">{detail}</p>}</div>
    {action}
  </div>;
}

export function ToastStack({ toasts, dismiss }: { toasts: { id: number; title: string; detail: string }[]; dismiss: (id: number) => void }) {
  return <div className="fixed bottom-5 right-5 z-[100] flex w-[min(380px,calc(100vw-40px))] flex-col gap-2">
    {toasts.map((toast) => <motion.div key={toast.id} initial={{ opacity: 0, x: 30, scale: .96 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border border-[#5c4333] bg-[#241b16] p-4 text-white shadow-2xl">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#d69b68] shadow-[0_0_0_5px_rgba(214,155,104,.12)]" />
        <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{toast.title}</p><p className="mt-1 text-xs leading-5 text-stone-300">{toast.detail}</p></div>
        <button onClick={() => dismiss(toast.id)} aria-label="Cerrar notificación" className="rounded-lg p-1 text-stone-400 hover:bg-white/10 hover:text-white"><X size={15} /></button>
      </div>
    </motion.div>)}
  </div>;
}

export function Modal({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/45 p-0 backdrop-blur-sm md:items-center md:p-6" onMouseDown={onClose}>
    <motion.div initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .2 }} onMouseDown={(event) => event.stopPropagation()} className="max-h-[92vh] w-full overflow-auto rounded-t-[28px] bg-[#fbfaf8] p-5 shadow-2xl md:max-w-2xl md:rounded-[28px] md:p-6">
      <div className="flex items-start justify-between gap-4"><div><h2 className="font-serif text-2xl tracking-tight text-stone-900">{title}</h2>{description && <p className="mt-1 text-sm text-stone-500">{description}</p>}</div><button onClick={onClose} className="rounded-xl border border-stone-200 bg-white p-2 text-stone-500 hover:text-stone-900"><X size={18} /></button></div>
      <div className="mt-6">{children}</div>
    </motion.div>
  </div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-semibold text-stone-600">{label}</span>{children}</label>;
}

export const inputClass = "h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#b77843] focus:ring-4 focus:ring-[#b77843]/10";
