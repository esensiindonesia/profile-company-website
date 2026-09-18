"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/admin";

function SidebarContent() {
  const pathname = usePathname();
  return (
    <>
      <div className="px-6 pt-6">
        <Image
          src="/logo-white.png"
          alt="Esensi Indonesia"
          width={194}
          height={37}
          className="h-6 w-auto"
        />
      </div>

      <nav className="mt-6 px-4">
        <Link
          href="/admin/certificates"
          aria-current={pathname.startsWith("/admin/certificates") ? "page" : undefined}
          className={`flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors ${
            pathname.startsWith("/admin/certificates") ? "bg-white/15" : "hover:bg-white/10"
          }`}
        >
          <Image
            src="/icons/RTM_file.svg"
            alt=""
            width={32}
            height={32}
            unoptimized
            className="size-4 shrink-0"
          />
          Certificates
        </Link>
        <Link
          href="/admin/services"
          aria-current={pathname.startsWith("/admin/services") ? "page" : undefined}
          className={`mt-1 flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors ${
            pathname.startsWith("/admin/services") ? "bg-white/15" : "hover:bg-white/10"
          }`}
        >
          <Image
            src="/icons/RTM_file.svg"
            alt=""
            width={32}
            height={32}
            unoptimized
            className="size-4 shrink-0"
          />
          Services
        </Link>
        <Link
          href="/admin/career"
          aria-current={pathname.startsWith("/admin/career") ? "page" : undefined}
          className={`mt-1 flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors ${
            pathname.startsWith("/admin/career") ? "bg-white/15" : "hover:bg-white/10"
          }`}
        >
          <Image
            src="/icons/RTM_file.svg"
            alt=""
            width={32}
            height={32}
            unoptimized
            className="size-4 shrink-0"
          />
          Career
        </Link>
      </nav>

      <div className="mt-auto p-4">
        <Button
          type="button"
          variant="ghost"
          onClick={logout}
          className="h-auto w-full justify-between rounded-lg bg-[#2F4770] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[#294067] hover:text-white"
        >
          Logout
          <LogOut aria-hidden />
        </Button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar (fixed) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[230px] flex-col bg-[#3B5A8B] md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-[#3B5A8B] px-4 py-3 md:hidden">
        <Image
          src="/logo-white.png"
          alt="Esensi Indonesia"
          width={194}
          height={37}
          className="h-5 w-auto"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="text-white hover:bg-white/10 hover:text-white"
        >
          <Menu aria-hidden />
        </Button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <Button
            type="button"
            variant="ghost"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-auto w-auto rounded-none bg-black/50 p-0 hover:bg-black/50"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[230px] flex-col bg-[#3B5A8B]">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-3 text-white hover:bg-white/10 hover:text-white"
            >
              <X aria-hidden />
            </Button>
            <SidebarContent />
          </aside>
        </div>
      ) : null}
    </>
  );
}
