import { AppShell } from "@/components/app-shell";
import { OperationsProvider } from "@/components/operations-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <OperationsProvider><AppShell>{children}</AppShell></OperationsProvider>;
}
