"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";
import { Stethoscope, LogOut, User, Key, Activity, Menu, X } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary shrink-0">
            <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base tracking-tight">ERM STIKES Paulo</span>
          </Link>
          <div className="hidden md:flex gap-6 ml-6 text-sm">
            <Link 
              href="/" 
              className={`transition-colors hover:text-foreground/80 ${pathname === "/" ? "text-foreground font-medium" : "text-foreground/60"}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/settings/api-keys" 
              className={`transition-colors hover:text-foreground/80 flex items-center gap-1 ${pathname.startsWith("/settings") ? "text-foreground font-medium" : "text-foreground/60"}`}
            >
              <Key className="h-3.5 w-3.5" /> API Keys
            </Link>
            <Link 
              href="/audit-logs" 
              className={`transition-colors hover:text-foreground/80 flex items-center gap-1 ${pathname.startsWith("/audit-logs") ? "text-foreground font-medium" : "text-foreground/60"}`}
            >
              <Activity className="h-3.5 w-3.5" /> Log Audit
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate max-w-[150px]">{userName}</span>
          </div>
          <form action={logoutAction} className="hidden md:block">
            <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </form>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-muted-foreground -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur absolute w-full left-0 p-4 flex flex-col gap-2 shadow-lg animate-in slide-in-from-top-2">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`transition-colors flex items-center gap-2 px-3 py-2.5 rounded-md text-sm ${pathname === "/" ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/settings/api-keys" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`transition-colors flex items-center gap-2 px-3 py-2.5 rounded-md text-sm ${pathname.startsWith("/settings") ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}
          >
            <Key className="h-4 w-4" /> API Keys
          </Link>
          <Link 
            href="/audit-logs" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`transition-colors flex items-center gap-2 px-3 py-2.5 rounded-md text-sm ${pathname.startsWith("/audit-logs") ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-muted"}`}
          >
            <Activity className="h-4 w-4" /> Log Audit
          </Link>
          <div className="border-t border-border/50 pt-4 mt-2">
            <div className="flex sm:hidden items-center gap-2 text-sm text-muted-foreground mb-4 px-3">
              <User className="h-4 w-4" />
              <span className="truncate">{userName}</span>
            </div>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit" className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
