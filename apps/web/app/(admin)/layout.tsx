import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-white font-body [&_button:not(:disabled)]:cursor-pointer">
        <AdminSidebar />
        <main className="md:pl-[230px]">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
