import type { Bill, DiningTable, KitchenOrder, MenuItem, Reservation, Waiter, WaitlistEntry } from "./types";

export const tablesSeed: DiningTable[] = [
  { id: 1, number: 1, capacity: 2, guests: 2, status: "Comiendo", waiter: "Sofía", since: "20:06", elapsed: 38, estimate: 34, area: "Ventanal" },
  { id: 2, number: 2, capacity: 2, guests: 0, status: "Libre", area: "Ventanal", features: ["Accesible"] },
  { id: 3, number: 3, capacity: 4, guests: 4, status: "Esperando pedido", waiter: "Martín", since: "20:37", elapsed: 7, estimate: 73, area: "Salón" },
  { id: 4, number: 4, capacity: 4, guests: 3, status: "Pedido enviado", waiter: "Sofía", since: "20:22", elapsed: 22, estimate: 58, area: "Salón" },
  { id: 5, number: 5, capacity: 6, guests: 6, status: "Comiendo", waiter: "Juan", since: "19:46", elapsed: 58, estimate: 18, area: "Salón", nextReservation: "22:15" },
  { id: 6, number: 6, capacity: 2, guests: 0, status: "Reservada", area: "Salón", nextReservation: "21:00" },
  { id: 7, number: 7, capacity: 4, guests: 4, status: "Esperando cuenta", waiter: "Juan", since: "19:34", elapsed: 70, estimate: 8, area: "Terraza" },
  { id: 8, number: 8, capacity: 6, guests: 5, status: "Pagando", waiter: "Martín", since: "19:28", elapsed: 76, estimate: 5, area: "Terraza" },
  { id: 9, number: 9, capacity: 2, guests: 0, status: "Limpieza", area: "Terraza", estimate: 4 },
  { id: 10, number: 10, capacity: 4, guests: 2, status: "Ocupada", waiter: "Sofía", since: "20:41", elapsed: 3, estimate: 77, area: "Ventanal", features: ["Silla bebé"] },
  { id: 11, number: 11, capacity: 8, guests: 7, status: "Comiendo", waiter: "Juan", since: "19:58", elapsed: 46, estimate: 30, area: "Salón" },
  { id: 12, number: 12, capacity: 4, guests: 0, status: "Libre", area: "Ventanal", features: ["Accesible", "Silla bebé"] },
];

export const ordersSeed: KitchenOrder[] = [
  { id: "K-184", table: 4, waiter: "Sofía", receivedAt: "20:22", elapsed: 22, status: "PREPARANDO", items: [
    { name: "New York Steak", quantity: 2, price: 32500, modifications: ["1 a punto", "1 jugoso"] },
    { name: "Caesar Salad", quantity: 1, price: 14900, modifications: ["Aderezo aparte"] },
  ] },
  { id: "K-185", table: 11, waiter: "Juan", receivedAt: "20:29", elapsed: 15, status: "PREPARANDO", items: [
    { name: "Kansas Burger", quantity: 3, price: 18900, modifications: ["1 sin cebolla", "Extra bacon x2"] },
    { name: "French Fries", quantity: 2, price: 7600 },
  ], note: "Una hamburguesa sin TACC — usar circuito separado" },
  { id: "K-186", table: 1, waiter: "Sofía", receivedAt: "20:33", elapsed: 11, status: "LISTO", items: [
    { name: "Key Lime Pie", quantity: 2, price: 9600 },
    { name: "Espresso", quantity: 2, price: 3900 },
  ] },
  { id: "K-187", table: 3, waiter: "Martín", receivedAt: "20:40", elapsed: 4, status: "RECIBIDO", items: [
    { name: "Houston Ribs", quantity: 1, price: 29800, modifications: ["Salsa aparte"] },
    { name: "Chicken Fingers", quantity: 2, price: 15600 },
  ] },
  { id: "K-188", table: 5, waiter: "Juan", receivedAt: "20:42", elapsed: 2, status: "RECIBIDO", items: [
    { name: "Cheesecake", quantity: 3, price: 10100 },
  ] },
];

export const reservationsSeed: Reservation[] = [
  { id: 1, name: "Valentina Ramos", phone: "11 4521-8820", time: "20:30", guests: 4, status: "Presente", preference: "Ventanal", table: 12 },
  { id: 2, name: "Tomás Greco", phone: "11 3402-1189", time: "21:00", guests: 2, status: "Confirmada", preference: "Salón", table: 6 },
  { id: 3, name: "Familia Pereira", phone: "11 6044-9012", time: "21:15", guests: 6, status: "Confirmada", preference: "Silla para bebé" },
  { id: 4, name: "Mariana Costa", phone: "11 5613-4477", time: "21:30", guests: 3, status: "Pendiente", preference: "Terraza" },
  { id: 5, name: "Ignacio de la Fuente", phone: "11 4455-9280", time: "22:00", guests: 8, status: "Confirmada", preference: "Cumpleaños" },
];

export const waitlistSeed: WaitlistEntry[] = [
  { id: 1, name: "Fernández", phone: "11 4550-7812", guests: 4, arrivedAt: "20:24", wait: 20, preference: "Ventanal", recommendation: 12 },
  { id: 2, name: "Vega", phone: "11 6088-1704", guests: 2, arrivedAt: "20:31", wait: 18, preference: "Sin preferencia", recommendation: 2 },
  { id: 3, name: "Lombardi", phone: "11 5220-6190", guests: 5, arrivedAt: "20:35", wait: 28, preference: "Terraza", recommendation: null },
];

export const menuSeed: MenuItem[] = [
  { id: 1, name: "Kansas Burger", description: "Blend de carne, cheddar, bacon y salsa Kansas", price: 18900, category: "Hamburguesas", availability: "Disponible", time: 18, popular: true },
  { id: 2, name: "New York Steak", description: "Bife de chorizo madurado con papas rústicas", price: 32500, category: "Principales", availability: "Disponible", time: 24, popular: true },
  { id: 3, name: "Houston Ribs", description: "Costillas BBQ cocidas lentamente y coleslaw", price: 29800, category: "Principales", availability: "Poco stock", time: 22, popular: true },
  { id: 4, name: "Caesar Salad", description: "Lechuga romana, parmesano, croutons y aderezo Caesar", price: 14900, category: "Entradas", availability: "Disponible", time: 9 },
  { id: 5, name: "Chicken Fingers", description: "Pollo crocante con honey mustard", price: 15600, category: "Entradas", availability: "Disponible", time: 12 },
  { id: 6, name: "French Fries", description: "Papas fritas clásicas, sal marina", price: 7600, category: "Acompañamientos", availability: "Disponible", time: 8 },
  { id: 7, name: "Key Lime Pie", description: "Lima, crema suave y base crocante", price: 9600, category: "Postres", availability: "Disponible", time: 4 },
  { id: 8, name: "Cheesecake", description: "Cheesecake estilo New York con frutos rojos", price: 10100, category: "Postres", availability: "Poco stock", time: 4 },
  { id: 9, name: "Limonada Kansas", description: "Limón, menta y jengibre", price: 5900, category: "Bebidas", availability: "Disponible", time: 3 },
  { id: 10, name: "Espresso", description: "Café espresso doble origen Brasil", price: 3900, category: "Bebidas", availability: "Disponible", time: 3 },
];

export const waitersSeed: Waiter[] = [
  { id: 1, name: "Sofía Acosta", initials: "SA", tables: 3, guests: 7, activeOrders: 2, alerts: 1, shift: "18:00–00:00", score: 38 },
  { id: 2, name: "Martín Gómez", initials: "MG", tables: 2, guests: 7, activeOrders: 2, alerts: 1, shift: "18:00–00:00", score: 43 },
  { id: 3, name: "Juan Álvarez", initials: "JA", tables: 3, guests: 17, activeOrders: 3, alerts: 2, shift: "18:00–00:00", score: 84 },
  { id: 4, name: "Camila Torres", initials: "CT", tables: 1, guests: 2, activeOrders: 0, alerts: 0, shift: "20:00–02:00", score: 22 },
];

export const billsSeed: Bill[] = [
  { id: 1, table: 7, guests: 4, status: "Solicitada", payments: 0, items: [
    { name: "New York Steak", quantity: 2, price: 32500 },
    { name: "Limonada Kansas", quantity: 2, price: 5900 },
    { name: "Key Lime Pie", quantity: 2, price: 9600 },
  ] },
  { id: 2, table: 8, guests: 5, status: "Pago parcial", payments: 42000, items: [
    { name: "Kansas Burger", quantity: 3, price: 18900 },
    { name: "Houston Ribs", quantity: 1, price: 29800 },
    { name: "Limonada Kansas", quantity: 4, price: 5900 },
  ] },
  { id: 3, table: 1, guests: 2, status: "Abierta", payments: 0, items: [
    { name: "Caesar Salad", quantity: 1, price: 14900 },
    { name: "New York Steak", quantity: 1, price: 32500 },
    { name: "Espresso", quantity: 2, price: 3900 },
  ] },
];

export const chartData = [38, 52, 47, 72, 64, 88, 92, 76, 84, 96, 81, 89];
