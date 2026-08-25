export type TableStatus =
  | "Libre"
  | "Ocupada"
  | "Reservada"
  | "Esperando pedido"
  | "Pedido enviado"
  | "Comiendo"
  | "Esperando cuenta"
  | "Pagando"
  | "Limpieza";

export type KitchenStatus = "RECIBIDO" | "PREPARANDO" | "LISTO" | "ENTREGADO";

export interface DiningTable {
  id: number;
  number: number;
  capacity: number;
  guests: number;
  status: TableStatus;
  waiter?: string;
  since?: string;
  elapsed?: number;
  estimate?: number;
  area: "Salón" | "Ventanal" | "Terraza";
  features?: string[];
  nextReservation?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  modifications?: string[];
}

export interface KitchenOrder {
  id: string;
  table: number;
  waiter: string;
  receivedAt: string;
  elapsed: number;
  status: KitchenStatus;
  items: OrderItem[];
  note?: string;
}

export interface Reservation {
  id: number;
  name: string;
  phone: string;
  time: string;
  guests: number;
  status: "Confirmada" | "Pendiente" | "Presente" | "Cancelada";
  preference: string;
  table?: number;
}

export interface WaitlistEntry {
  id: number;
  name: string;
  phone: string;
  guests: number;
  arrivedAt: string;
  wait: number;
  preference: string;
  recommendation: number | null;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  availability: "Disponible" | "Poco stock" | "No disponible";
  time: number;
  popular?: boolean;
}

export interface Waiter {
  id: number;
  name: string;
  initials: string;
  tables: number;
  guests: number;
  activeOrders: number;
  alerts: number;
  shift: string;
  score: number;
}

export interface Bill {
  id: number;
  table: number;
  guests: number;
  items: OrderItem[];
  status: "Abierta" | "Solicitada" | "Pago parcial";
  payments: number;
}
