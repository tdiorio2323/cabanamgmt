// Auth is handled by parent (dash) layout
// This layout is just a passthrough for dashboard-specific layouts if needed
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
