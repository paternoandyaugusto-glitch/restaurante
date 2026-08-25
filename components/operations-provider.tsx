"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { billsSeed, ordersSeed, reservationsSeed, tablesSeed, waitlistSeed } from "@/lib/data";
import type { Bill, DiningTable, KitchenOrder, KitchenStatus, Reservation, TableStatus, WaitlistEntry } from "@/lib/types";

type Toast = { id: number; title: string; detail: string };

interface OperationsContextValue {
  tables: DiningTable[];
  orders: KitchenOrder[];
  reservations: Reservation[];
  waitlist: WaitlistEntry[];
  bills: Bill[];
  toasts: Toast[];
  updateTableStatus: (id: number, status: TableStatus) => void;
  advanceOrder: (id: string) => void;
  seatWaitlist: (id: number) => void;
  addWaitlist: (entry: Omit<WaitlistEntry, "id" | "arrivedAt" | "wait" | "recommendation">) => void;
  addReservation: (reservation: Omit<Reservation, "id" | "status">) => void;
  addOrder: (table: number, items: KitchenOrder["items"]) => void;
  addPayment: (billId: number, amount: number) => void;
  dismissToast: (id: number) => void;
}

const OperationsContext = createContext<OperationsContextValue | null>(null);

const nextStatus: Record<KitchenStatus, KitchenStatus> = {
  RECIBIDO: "PREPARANDO",
  PREPARANDO: "LISTO",
  LISTO: "ENTREGADO",
  ENTREGADO: "ENTREGADO",
};

export function OperationsProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState(tablesSeed);
  const [orders, setOrders] = useState(ordersSeed);
  const [reservations, setReservations] = useState(reservationsSeed);
  const [waitlist, setWaitlist] = useState(waitlistSeed);
  const [bills, setBills] = useState(billsSeed);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((title: string, detail: string) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, title, detail }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4500);
  }, []);

  const updateTableStatus = useCallback((id: number, status: TableStatus) => {
    setTables((current) => current.map((table) => table.id === id ? {
      ...table,
      status,
      guests: status === "Libre" ? 0 : table.guests,
      waiter: status === "Libre" ? undefined : table.waiter,
      elapsed: status === "Libre" ? undefined : table.elapsed,
    } : table));
    notify("Mesa actualizada", `El estado cambió a ${status.toLowerCase()}.`);
  }, [notify]);

  const advanceOrder = useCallback((id: string) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status: nextStatus[order.status] } : order));
    const order = orders.find((item) => item.id === id);
    if (!order) return;
    const status = nextStatus[order.status];
    if (status === "LISTO") notify(`Mesa ${order.table} · Pedido listo`, `${order.waiter} recibió la notificación para retirar.`);
    if (status === "ENTREGADO") {
      setTables((current) => current.map((table) => table.number === order.table ? { ...table, status: "Comiendo" } : table));
      notify(`Mesa ${order.table} · Entregado`, "El pedido quedó registrado como entregado.");
    }
  }, [notify, orders]);

  const seatWaitlist = useCallback((id: number) => {
    const entry = waitlist.find((item) => item.id === id);
    if (!entry?.recommendation) return;
    const tableNumber = entry.recommendation;
    setTables((current) => current.map((table) => table.number === tableNumber ? {
      ...table,
      guests: entry.guests,
      status: "Ocupada",
      waiter: "Camila",
      elapsed: 0,
      since: "Ahora",
      estimate: 80,
    } : table));
    setWaitlist((current) => current.filter((item) => item.id !== id));
    notify(`Mesa ${tableNumber} asignada`, `Grupo ${entry.name} · ${entry.guests} personas · Camila atenderá la mesa.`);
  }, [notify, waitlist]);

  const addWaitlist = useCallback((entry: Omit<WaitlistEntry, "id" | "arrivedAt" | "wait" | "recommendation">) => {
    const compatible = tables
      .filter((table) => table.status === "Libre" && table.capacity >= entry.guests)
      .sort((a, b) => a.capacity - b.capacity)[0];
    setWaitlist((current) => [...current, {
      ...entry,
      id: Math.max(0, ...current.map((item) => item.id)) + 1,
      arrivedAt: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      wait: compatible ? 3 : 25,
      recommendation: compatible?.number ?? null,
    }]);
    notify("Grupo agregado", `${entry.name} ya aparece en la lista de espera.`);
  }, [notify, tables]);

  const addReservation = useCallback((reservation: Omit<Reservation, "id" | "status">) => {
    setReservations((current) => [...current, {
      ...reservation,
      id: Math.max(0, ...current.map((item) => item.id)) + 1,
      status: "Pendiente",
    }]);
    notify("Reserva creada", `${reservation.name} · ${reservation.time} · ${reservation.guests} personas.`);
  }, [notify]);

  const addOrder = useCallback((table: number, items: KitchenOrder["items"]) => {
    const id = `K-${189 + orders.length}`;
    setOrders((current) => [...current, {
      id,
      table,
      waiter: tables.find((item) => item.number === table)?.waiter ?? "Sofía",
      receivedAt: "Ahora",
      elapsed: 0,
      status: "RECIBIDO",
      items,
    }]);
    setTables((current) => current.map((item) => item.number === table ? { ...item, status: "Pedido enviado" } : item));
    notify(`Pedido ${id} enviado`, `Cocina recibió ${items.reduce((sum, item) => sum + item.quantity, 0)} productos de la mesa ${table}.`);
  }, [notify, orders.length, tables]);

  const addPayment = useCallback((billId: number, amount: number) => {
    setBills((current) => current.map((bill) => bill.id === billId ? { ...bill, payments: bill.payments + amount, status: "Pago parcial" } : bill));
    notify("Pago registrado", "El saldo de la cuenta se actualizó en tiempo real.");
  }, [notify]);

  const value = useMemo(() => ({
    tables, orders, reservations, waitlist, bills, toasts,
    updateTableStatus, advanceOrder, seatWaitlist, addWaitlist, addReservation, addOrder, addPayment,
    dismissToast: (id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)),
  }), [tables, orders, reservations, waitlist, bills, toasts, updateTableStatus, advanceOrder, seatWaitlist, addWaitlist, addReservation, addOrder, addPayment]);

  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
}

export function useOperations() {
  const context = useContext(OperationsContext);
  if (!context) throw new Error("useOperations must be used within OperationsProvider");
  return context;
}
