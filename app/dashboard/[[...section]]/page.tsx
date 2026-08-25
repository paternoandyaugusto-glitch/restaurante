import { DashboardRouter } from "@/components/dashboard/dashboard-router";

export default async function DashboardPage({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section } = await params;
  return <DashboardRouter section={section?.[0] ?? "overview"} />;
}
