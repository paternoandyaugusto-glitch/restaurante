import Link from "next/link";
import { ArrowLeft, Settings2 } from "lucide-react";
import { Card, PageHeader, StatusBadge } from "../ui";

export function PlaceholderView() {
  return <div className="space-y-6"><PageHeader eyebrow="Administración" title="Configuración del restaurante" description="Base preparada para el setup multi-local, permisos y umbrales de servicio." actions={<StatusBadge tone="copper">Próximo módulo</StatusBadge>} /><Card className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f1e4d8] text-[#9b6037]"><Settings2 size={26} /></span><h2 className="mt-6 font-serif text-3xl">La operación primero.</h2><p className="mt-3 max-w-md text-sm leading-6 text-stone-500">La demo prioriza el recorrido operativo del MVP. Configuración, inventario avanzado y reportes entran en la siguiente etapa documentada.</p><Link href="/dashboard" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#211a16] px-4 py-3 text-xs font-semibold text-white"><ArrowLeft size={14} />Volver al resumen</Link></Card></div>;
}
