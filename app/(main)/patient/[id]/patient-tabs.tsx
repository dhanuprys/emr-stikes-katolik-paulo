"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Stethoscope, FileText, FlaskConical, Sparkles, BookOpenCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PatientTabs({ patientId }: { patientId: string }) {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Identitas",
      href: `/patient/${patientId}`,
      icon: User,
      exact: true,
    },
    {
      name: "Asesmen Awal",
      href: `/patient/${patientId}/assessment`,
      icon: Stethoscope,
      exact: false,
    },
    {
      name: "Timbang Terima",
      href: `/patient/${patientId}/cppt`,
      icon: FileText,
      exact: false,
    },
    {
      name: "Hasil Lab",
      href: `/patient/${patientId}/lab`,
      icon: FlaskConical,
      exact: false,
    },
    {
      name: "Resume",
      href: `/patient/${patientId}/resume`,
      icon: BookOpenCheckIcon,
      exact: false,
    },
    {
      name: "Ringkasan AI",
      href: `/patient/${patientId}/ai-summary`,
      special: true,
      icon: Sparkles,
      exact: false,
    }
  ];

  return (
    <div className="flex overflow-x-auto border-b border-border hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
              isActive
                ? "border-primary text-primary"
                : tab.special
                  ? "border-transparent text-yellow-700 hover:text-yellow-500"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
