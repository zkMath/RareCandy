"use client";

import { useRouter } from "next/navigation";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/hooks/useAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Connect your wallet to access the admin dashboard.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Access denied. Admin wallet required.</p>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-plum-600 hover:text-plum-700 font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 ml-[72px] lg:ml-[260px] transition-all">
        <AdminTopBar />
        <main className="relative">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top right, #ebe4f3 0%, #f0ecf5 35%, #f6f3f0 65%, #faf6f3 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
          </div>
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
