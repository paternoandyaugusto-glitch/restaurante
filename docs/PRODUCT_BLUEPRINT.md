# Kansas Operations — Product Blueprint

## 1. Product direction

Kansas Operations is a multi-tenant restaurant operating system designed for a fast, high-touch service. The product joins reception, floor, kitchen and checkout in one real-time workspace while preserving Kansas Grill & Bar's warm, contemporary American character.

The MVP optimizes the critical service loop:

`arrival → table assignment → waiter assignment → order → kitchen → delivery → bill → payment → cleaning`

The first release is a tablet/desktop responsive web application. It behaves as an installable operational surface and is prepared for a future PWA/mobile layer without coupling business rules to the UI.

## 2. Proposed architecture

### Frontend

- Next.js App Router, React and TypeScript.
- Tailwind CSS for the design system; CSS variables hold the Kansas palette and spacing primitives.
- Framer Motion for restrained page, card and state transitions.
- Server Components for data-heavy read views; Client Components only around interaction, optimistic updates and real-time events.
- React Context in the prototype; TanStack Query plus a typed API client in production.
- Responsive breakpoints prioritize 1024–1366 px tablets and operational desktops, then adapt to phones.

### Backend

- Modular Node.js application behind Next.js route handlers or a separately deployable API service.
- Modules: identity, tenancy, floor, seating, workforce, reservations, waitlist, menu, ordering, kitchen, billing, payments, notifications and inventory.
- REST commands/queries for regular mutations. A WebSocket gateway distributes restaurant-scoped domain events.
- Idempotency keys on order, bill and payment commands prevent double submission on unstable Wi-Fi.
- PostgreSQL transactions protect critical transitions such as sending an order, splitting a bill and closing a table.

### Data and infrastructure

- PostgreSQL with `restaurant_id` on every tenant-owned table and row-level tenant guards.
- Redis for presence, short-lived locks, kitchen timers, queues and WebSocket fan-out.
- Object storage for menu and tenant media.
- Background workers for reservation reminders, no-show transitions, reports and inventory projections.
- Structured audit log for discounts, voids, payment changes and administrative actions.
- Observability: request IDs, event IDs, latency/error metrics and operational dashboards.

### Real-time contract

All channels are scoped as `restaurant:{restaurantId}`. Clients subscribe only after authorization.

- `table.updated`
- `table.assignment.updated`
- `order.created`
- `order.status.changed`
- `bill.updated`
- `payment.recorded`
- `reservation.updated`
- `waitlist.updated`
- `notification.created`
- `inventory.alert.created` (stage 2)

The UI applies optimistic changes, reconciles the server event by version, and requests a compact snapshot only after reconnect. Each aggregate stores a monotonically increasing `version` to reject stale writes.

### Suggested repository boundaries

```text
app/                  routes, layouts and API adapters
components/           reusable visual and operational components
features/             domain-specific client modules
lib/domain/           pure business rules and policies
lib/server/           services, repositories, auth and events
prisma/               schema, migrations and seed
public/               product-owned static assets
tests/                unit, integration and end-to-end tests
docs/                 architecture and product decisions
```

The implemented prototype keeps the same conceptual boundaries while using a local store and realistic seed data, so the complete operational journey is reviewable without external services.

## 3. Navigation and sitemap

### Public

- `/` — Commercial landing
- `/login` — Role-aware login entry
- `/menu/[restaurantSlug]` — Public QR menu (MVP-ready route, later hardening)
- `/demo` — Guided product demonstration (can resolve to seeded workspace)

### Authenticated application

- `/dashboard` — Live executive/service overview
- `/dashboard/tables` — Floor map and table details
- `/dashboard/orders` — Table order taking
- `/dashboard/kitchen` — Kitchen Display System
- `/dashboard/reservations` — Day/week reservation management
- `/dashboard/waitlist` — Waiting list and seating recommendation
- `/dashboard/billing` — Bills, splits and payments
- `/dashboard/menu` — Categories, items, availability and modifiers
- `/dashboard/team` — Shifts, assigned tables and workload
- `/dashboard/reports` — Stage 2 reports
- `/dashboard/inventory` — Stage 2 inventory
- `/dashboard/settings` — Restaurant, floor, roles, service thresholds

Role-specific home screens reuse this map while hiding unauthorized modules. Navigation is permission-driven, not role-name-driven.

## 4. Principal screens

### Landing

Editorial hero, problem framing, connected operations modules, visual product proof, measurable benefits and demo CTA. Restaurant imagery gives way progressively to product UI to connect hospitality quality with operational control.

### Dashboard

An at-a-glance service summary: occupancy, active guests, order status, wait times, sales, service alerts, kitchen performance and staff load. The dashboard is triage-oriented, not reporting-heavy.

### Floor map

Zone filters, visual table cards, capacity/guest count, waiter, elapsed time, next reservation and status. Selecting a table opens an action panel. The primary actions are seat, take order, request bill and mark clean.

### Digital ordering

Table context remains visible. Category rail, search, large product targets and a persistent cart keep the common path within three interactions. Items support guest assignment, modifiers, notes and quantity.

### Kitchen Display System

Large chronological tickets grouped by `received`, `preparing` and `ready`. Timer severity is independent of color alone and late tickets carry explicit labels. One primary action advances a ticket.

### Reservations and waitlist

Reservation calendar/list and a fast walk-in form. The recommendation engine scores capacity fit, accessibility, location preference, reservation conflicts and expected release time.

### Billing

Open bills with itemized lines. Split options: equal, by guest/product or custom. Multiple partial payments are accepted until the remaining balance reaches zero.

### Team

Waiter cards display tables, guests, open orders and urgent attention. A normalized workload score recommends the next assignment while allowing reception to override it.

## 5. User flows

### Walk-in to seated

1. Reception registers party size and needs.
2. `TableRecommendationService` returns ranked compatible tables.
3. Reception confirms the suggested table.
4. `WorkloadPolicy` suggests an on-shift waiter.
5. Seating creates a visit, assigns both table and waiter, and broadcasts `table.updated`.

### Order to delivery

1. Waiter opens one assigned table and selects a guest.
2. Items and modifiers are added locally.
3. Confirmation creates an order and immutable preparation lines.
4. Kitchen receives `order.created` immediately.
5. Kitchen moves the ticket through received, preparing and ready.
6. Ready creates a targeted waiter notification.
7. Waiter marks delivered; the table moves to eating.

### Bill split and close

1. Waiter/cashier requests the table bill.
2. Items, discounts and prior payments are loaded from the server.
3. A split strategy creates payable portions while preserving the original bill.
4. Each payment is recorded idempotently with method and reference.
5. When balance is zero, the bill and visit close atomically and the table moves to cleaning.
6. Cleaning completion releases the table and triggers waitlist matching.

### Reservation lifecycle

`pending → confirmed → arrived → completed`

Exceptional paths are `pending/confirmed → cancelled` and `confirmed → no_show`. Seating a reservation creates a visit and table association; it never reuses the reservation record as an active visit.

## 6. Data model

Every tenant table includes `id`, `restaurant_id`, timestamps and, where concurrent mutation matters, `version`.

### Identity and tenancy

- `Restaurant`: name, slug, timezone, currency, service thresholds, plan.
- `User`: email, password hash/provider, status, last login.
- `Employee`: restaurant, user, display name, phone, status.
- `Role`: restaurant/system role name.
- `Permission`: stable action key.
- `EmployeeRole`, `RolePermission`: many-to-many joins.
- `Shift`: employee, role, start/end, status.

### Floor and guests

- `DiningArea`: name, floor, display order.
- `Table`: area, number, capacity, position/size, state, active visit.
- `TableFeature`: stable feature key such as accessible, outdoor or high-chair nearby.
- `TableTableFeature`: table-feature join.
- `Customer`: name, phone, preferences and consent flags.
- `CustomerGroup`: size, host customer and requested features.
- `Visit`: group, table, assigned employee, seated/closed timestamps and state.

### Reservations and queue

- `Reservation`: customer/group, start, duration, party size, status, notes, optional assigned table.
- `WaitingListEntry`: group, arrival, quoted wait, priority, status, suggested table and notification state.

### Menu and ordering

- `MenuCategory`: name, image, service periods and display order.
- `MenuItem`: category, name, description, price, availability and prep station.
- `ModifierGroup`, `ModifierOption`, `MenuItemModifierGroup`: customization model.
- `Order`: visit/table, waiter, status, source, opened/sent timestamps.
- `OrderItem`: menu item snapshot, quantity, unit price, guest number, station and state.
- `OrderItemModifier`: modifier snapshot and price delta.
- `OrderStatusHistory`: actor, from/to state and timestamp.

### Billing and payments

- `Bill`: visit/table, subtotal, discount, tax, total, paid amount and status.
- `BillLine`: order item snapshot, quantity and amounts.
- `BillSplit`: strategy, label and target amount.
- `BillSplitLine`: split-to-bill-line allocation.
- `Payment`: bill/split, method, amount, provider reference, status and cashier.
- `Discount`: reason, type/value, approver and audit metadata.

### Inventory (stage 2)

- `Ingredient`: name, category and canonical unit.
- `InventoryItem`: ingredient, location, current/min stock, average cost and expiry policy.
- `InventoryLot`: quantity, expiry date, supplier and unit cost.
- `StockMovement`: type, quantity, order/waste/purchase reference and actor.
- `Supplier`: contact and ordering data.
- `Recipe`: menu item, yield and version.
- `RecipeIngredient`: recipe, ingredient, quantity and unit.

### Communication and controls

- `Notification`: recipient/role, event, message, read timestamp and urgency.
- `AuditLog`: actor, action, entity, before/after and request ID.
- `OutboxEvent`: transactionally recorded event awaiting delivery.

### Key relationships

```text
Restaurant 1──* Employee *──* Role *──* Permission
Restaurant 1──* DiningArea 1──* Table *──* TableFeature
Customer 1──* Reservation *──0..1 Table
CustomerGroup 1──* Visit *──1 Table
Visit 1──* Order 1──* OrderItem *──1 MenuItem
MenuItem 1──* Recipe 1──* RecipeIngredient *──1 Ingredient
Visit 1──1 Bill 1──* BillLine
Bill 1──* BillSplit 1──* BillSplitLine
Bill 1──* Payment
Ingredient 1──* InventoryItem 1──* InventoryLot
```

Money uses integer minor units, never floating-point. Quantity uses `numeric(14,4)` plus a canonical unit. Historical order/bill lines retain name and price snapshots even if the menu changes.

## 7. Roles and permission matrix

| Capability | Admin | Reception | Waiter | Kitchen | Cashier |
|---|---:|---:|---:|---:|---:|
| View live dashboard | ✓ | limited | own | kitchen | billing |
| Manage floor / seat guests | ✓ | ✓ | own status | — | close only |
| Reservations / waitlist | ✓ | ✓ | view | — | view |
| Create / edit open orders | ✓ | — | ✓ own | view | view |
| Advance kitchen tickets | ✓ | — | delivered | ✓ | — |
| Request / split bill | ✓ | — | ✓ own | — | ✓ |
| Apply discount | ✓ | — | request | — | with limit |
| Record payment | ✓ | — | permitted | — | ✓ |
| Close table | ✓ | reception clean | paid own | — | ✓ |
| Manage menu | ✓ | availability view | availability view | availability | — |
| Manage employees / roles | ✓ | — | — | — | — |
| Reports / settings | ✓ | — | own metrics | kitchen metrics | shift totals |

Authorization is enforced in the service layer and repeated in UI affordances. A hidden button is never the security boundary.

## 8. Reusable component inventory

- `AppShell`, `Sidebar`, `MobileNav`, `Topbar`, `RoleSwitcher`
- `PageHeader`, `SectionHeading`, `KpiCard`, `StatusBadge`, `TrendBadge`
- `TableCard`, `FloorLegend`, `TableActionSheet`, `ElapsedTimer`
- `OrderTicket`, `OrderLine`, `ModifierList`, `TicketTimer`
- `MenuItemCard`, `CategoryTabs`, `OrderCart`, `GuestSelector`
- `ReservationRow`, `WaitlistRow`, `RecommendationCard`
- `BillSummary`, `SplitSelector`, `PaymentMethodButton`
- `WorkloadCard`, `LoadMeter`, `AssignmentRecommendation`
- `EmptyState`, `Toast`, `ConfirmDialog`, `Sheet`, `SegmentedControl`
- `AnimatedNumber`, `Reveal`, `StaggerList` for calm motion primitives

## 9. Business rules to isolate

- Table recommendation: hard constraints first, then smallest sufficient capacity, preference match, future reservation risk and area balance.
- Waiter recommendation: active table count, guest count, waiting-attention count, active orders and shift availability.
- Ticket lateness: thresholds configurable per station/category; state is derived from sent/started time.
- Order editing: sent preparation lines are changed through explicit amendment/void operations, not silent mutation.
- Bill split: allocated amount must equal bill outstanding amount; paid allocations cannot be reassigned.
- Payment: duplicate provider/idempotency references are rejected.
- Table close: only a zero-balance bill can transition to cleaning unless an authorized comp/house-account workflow exists.

## 10. MVP roadmap

### Foundation — delivered by this prototype

- Brand system, responsive shell and role-oriented navigation.
- Realistic seeded service state.
- Dashboard, floor map, order entry, KDS, reservations, waitlist, bills and staff workload.
- Interactive status transitions, table assignment, new order flow, notifications and bill split preview.
- Commercial landing and login/demo entry.

### Production MVP — 8–12 weeks

1. Tenancy, authentication, sessions, permissions and audit trail.
2. PostgreSQL schema/migrations and restaurant/floor/menu administration.
3. Real order, KDS and table state commands with WebSockets and offline retry.
4. Reservations, waitlist and SMS/WhatsApp provider integration.
5. Bills, discounts, split allocation, payments and fiscal/POS adapter boundary.
6. Hardening: automated tests, observability, backups, security review and pilot rollout.

### Stage 2

- Inventory lots, recipes, automatic consumption and waste.
- Low-stock/expiry alerts, suppliers and purchasing.
- Advanced sales, kitchen, table, reservation and staff reports.

### Stage 3

- Demand forecasting, prep recommendations and schedule suggestions.
- Rule-based automations followed by explainable AI recommendations.
- Cross-location analytics, benchmarks and anomaly detection.

## 11. Definition of success

- A waiter can send a common order in no more than three primary interactions after opening a table.
- Kitchen sees a new ticket within two seconds at p95 under pilot load.
- Every occupied table has an owner, elapsed time and actionable state.
- Reception can quote a wait and seat a compatible party without switching tools.
- A split payment never creates an unallocated or overpaid balance.
- Operational state remains understandable without relying on color alone.
- All tenant data access and event subscriptions are restaurant-scoped.

