"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BillingView } from "./billing-view";
import { KitchenView } from "./kitchen-view";
import { MenuTeamView } from "./menu-team-view";
import { OrdersView } from "./orders-view";
import { Overview } from "./overview";
import { ReservationsView, WaitlistView } from "./reservations-view";
import { TablesView } from "./tables-view";
import { PlaceholderView } from "./placeholder-view";

export function DashboardRouter({ section }: { section: string }) {
  const views: Record<string, React.ReactNode> = {
    overview: <Overview />,
    tables: <TablesView />,
    orders: <OrdersView />,
    kitchen: <KitchenView />,
    reservations: <ReservationsView />,
    waitlist: <WaitlistView />,
    billing: <BillingView />,
    menu: <MenuTeamView mode="menu" />,
    team: <MenuTeamView mode="team" />,
    settings: <PlaceholderView />,
  };
  return <AnimatePresence mode="wait"><motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}>{views[section] ?? <Overview />}</motion.div></AnimatePresence>;
}
