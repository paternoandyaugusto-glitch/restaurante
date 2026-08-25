"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState("Administrador");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  function enter() { setLoading(true); window.setTimeout(() => router.push(role === "Cocina" ? "/dashboard/kitchen" : "/dashboard"), 650); }
  return <main className="grid min-h-screen bg-[#f5f1eb] lg:grid-cols-[1.05fr_.95fr]">
    <section className="relative hidden overflow-hidden lg:block"><Image src="/images/kansas-hero.png" alt="Interior cálido de restaurante" fill priority sizes="55vw" className="object-cover object-[65%_center]" /><div className="absolute inset-0 bg-gradient-to-t from-[#17120f]/90 via-[#17120f]/20 to-[#17120f]/35" /><Link href="/" className="absolute left-8 top-8 flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white"><ArrowLeft size={15} />Volver al sitio</Link><div className="absolute bottom-12 left-12 max-w-lg text-white"><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#dda36f]">Kansas Operations</p><p className="mt-4 font-serif text-5xl leading-[1.04] tracking-[-.04em]">Cada detalle del servicio, en su lugar.</p><p className="mt-5 max-w-md text-sm leading-6 text-stone-300">Una operación conectada permite que el equipo se concentre en lo más importante: la experiencia del cliente.</p></div></section>
    <section className="flex items-center justify-center p-5 sm:p-10"><div className="w-full max-w-[440px]"><Link href="/" className="mb-12 inline-flex items-center gap-3 lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211a16] font-serif text-xl text-white">K</span><span className="font-serif tracking-[.1em]">KANSAS</span></Link><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#9b6037]">Bienvenido de nuevo</p><h1 className="mt-3 font-serif text-4xl tracking-[-.04em]">Ingresá a tu operación</h1><p className="mt-3 text-sm leading-6 text-stone-500">Accedé a la demo con cualquiera de los perfiles disponibles.</p>
      <div className="mt-8"><label className="text-xs font-semibold text-stone-600">Perfil de la demo</label><div className="mt-2 grid grid-cols-3 gap-2">{["Administrador", "Mozo", "Cocina"].map((item) => <button key={item} onClick={() => setRole(item)} className={`rounded-xl border px-2 py-3 text-xs font-semibold transition ${role === item ? "border-[#9b6037] bg-[#efe1d4] text-[#7c4928]" : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"}`}>{item}</button>)}</div></div>
      <div className="mt-6 space-y-4"><label className="block"><span className="mb-2 block text-xs font-semibold text-stone-600">Correo</span><span className="relative block"><Mail size={16} className="absolute left-3.5 top-3.5 text-stone-400" /><input defaultValue="demo@kansas.com.ar" className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#b77843] focus:ring-4 focus:ring-[#b77843]/10" /></span></label><label className="block"><span className="mb-2 block text-xs font-semibold text-stone-600">Contraseña</span><span className="relative block"><LockKeyhole size={16} className="absolute left-3.5 top-3.5 text-stone-400" /><input type="password" defaultValue="kansasdemo" className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-11 text-sm outline-none focus:border-[#b77843] focus:ring-4 focus:ring-[#b77843]/10" /><Eye size={16} className="absolute right-3.5 top-3.5 text-stone-400" /></span></label></div>
      <button onClick={enter} disabled={loading} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#211a16] text-sm font-semibold text-white transition hover:bg-[#392a22] disabled:opacity-70">{loading ? "Preparando el servicio…" : <>Ingresar como {role} <ArrowRight size={16} /></>}</button><p className="mt-6 text-center text-[11px] leading-5 text-stone-400">Demo interactiva con datos simulados. No se almacenan credenciales.</p>
    </div></section>
  </main>;
}
