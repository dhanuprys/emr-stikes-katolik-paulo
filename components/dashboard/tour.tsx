"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourIntro } from "@/components/dashboard/tour-intro";

export const TOUR_STORAGE_KEY = "sigap_tour_continue";

export function DashboardTour({
  hasPatients,
  firstPatientId,
}: {
  hasPatients: boolean;
  firstPatientId?: string;
}) {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);

  const runTour = useCallback(() => {
    const steps: DriveStep[] = [
      {
        element: "#tour-nav-dashboard",
        popover: {
          title: "Dashboard",
          description: "Halaman utama yang menampilkan daftar seluruh pasien, status rawat, dan statistik singkat.",
          side: "bottom" as const,
          align: "start" as const,
        },
      },
      {
        element: "#tour-nav-apikeys",
        popover: {
          title: "API Keys",
          description: "Kelola kunci API untuk integrasi fitur Ringkasan AI. Tambah, aktifkan, atau nonaktifkan kunci sesuai kebutuhan.",
          side: "bottom" as const,
          align: "start" as const,
        },
      },
      {
        element: "#tour-nav-auditlog",
        popover: {
          title: "Log Audit",
          description: "Riwayat seluruh aktivitas perubahan data dalam sistem — berguna untuk kepatuhan dan keamanan.",
          side: "bottom" as const,
          align: "start" as const,
        },
      },
      {
        element: "#tour-search",
        popover: {
          title: "Pencarian Pasien",
          description: "Ketik nama atau nomor RM untuk menemukan pasien dengan cepat dari seluruh data yang tersedia.",
          side: "bottom" as const,
          align: "start" as const,
        },
      },
      {
        element: "#tour-stats",
        popover: {
          title: "Ringkasan Statistik",
          description: "Menampilkan total pasien, jumlah yang sedang dirawat (Dirawat), dan yang sudah keluar (KRS) secara real-time.",
          side: "bottom" as const,
          align: "end" as const,
        },
      },
      {
        element: "#tour-btn-tambah-pasien",
        popover: {
          title: "Tambah Pasien Baru",
          description: "Klik tombol ini untuk mendaftarkan pasien baru ke dalam sistem.",
          side: "bottom" as const,
          align: "end" as const,
        },
      },
    ];

    if (hasPatients && firstPatientId) {
      steps.push(
        {
          element: "#tour-patient-card",
          popover: {
            title: "2. Kartu Pasien",
            description:
              "Setiap kartu menampilkan ringkasan data pasien: nama, RM, diagnosa, dan status rawat.",
            side: "bottom" as const,
            align: "start" as const,
          },
        },
        {
          element: "#tour-btn-edit",
          popover: {
            title: "3. Edit Identitas",
            description: "Klik ikon ini untuk mengubah data identitas pasien.",
            side: "top" as const,
            align: "end" as const,
          },
        },
        {
          element: "#tour-btn-buka",
          popover: {
            title: "4. Buka Detail Pasien →",
            description:
              'Klik <strong>"Buka & Lanjutkan Tour"</strong> untuk masuk ke halaman detail pasien!',
            side: "top" as const,
            align: "start" as const,
            nextBtnText: "Buka & Lanjutkan Tour →",
          },
        },
      );
    }

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "rgba(0, 0, 0, 0.5)",
      stagePadding: 10,
      stageRadius: 12,
      nextBtnText: "Lanjut →",
      prevBtnText: "← Kembali",
      doneBtnText: "Selesai ✓",
      progressText: "{{current}} dari {{total}}",
      onNextClick: () => {
        const currentIndex = driverObj.getActiveIndex() ?? 0;
        const isLastStep = currentIndex === steps.length - 1;

        if (isLastStep && firstPatientId) {
          sessionStorage.setItem(TOUR_STORAGE_KEY, "detail");
          driverObj.destroy();
          router.push(`/patient/${firstPatientId}`);
        } else {
          driverObj.moveNext();
        }
      },
      steps,
    });

    driverObj.drive();
  }, [hasPatients, firstPatientId, router]);

  const handlePanduan = () => {
    setShowIntro(true);
  };

  const handleConfirm = () => {
    setShowIntro(false);
    // Restore navbar first, then start tour after it slides back in
    const nav = document.querySelector("nav") as HTMLElement | null;
    if (nav) {
      nav.style.transform = "translateY(0)";
    }
    setTimeout(() => runTour(), 450);
  };

  const handleDismiss = () => {
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <TourIntro onConfirm={handleConfirm} onDismiss={handleDismiss} />}

      <Button
        variant="outline"
        size="sm"
        onClick={handlePanduan}
        className="gap-1.5 bg-white/80 backdrop-blur text-muted-foreground hover:text-primary"
        title="Panduan Dashboard"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Panduan</span>
      </Button>
    </>
  );
}
