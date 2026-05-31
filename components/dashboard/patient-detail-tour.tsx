"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { TOUR_STORAGE_KEY } from "@/components/dashboard/tour";
import { CheckCircle2, X } from "lucide-react";

export function PatientDetailTour() {
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    const shouldContinue = sessionStorage.getItem(TOUR_STORAGE_KEY) === "detail";
    if (!shouldContinue) return;

    // Clear flag so refresh doesn't re-trigger
    sessionStorage.removeItem(TOUR_STORAGE_KEY);

    // Wait for DOM + hydration to settle before querying IDs
    const timer = window.setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(0, 0, 0, 0.55)",
        stagePadding: 10,
        stageRadius: 12,
        nextBtnText: "Lanjut →",
        prevBtnText: "← Kembali",
        doneBtnText: "Selesai ✓",
        progressText: "{{current}} dari {{total}}",
        onDestroyed: () => setShowDone(true),
        steps: [
          {
            element: "#tour-patient-header",
            popover: {
              title: "Informasi Pasien",
              description:
                "Panel ini menampilkan ringkasan identitas pasien: nama, No. RM, gender, umur, dan dokter penanggung jawab.",
              side: "bottom" as const,
              align: "start" as const,
            },
          },
          {
            element: "#tour-patient-avatar",
            popover: {
              title: "Foto Pasien",
              description:
                "Klik pada foto (atau ikon kamera) untuk mengunggah foto pasien. Foto memudahkan perawat mengenali pasien secara visual.",
              side: "right" as const,
              align: "start" as const,
            },
          },
          {
            element: "#tour-patient-status",
            popover: {
              title: "Status Rawat",
              description:
                "Menampilkan status pasien: Dirawat (hijau) atau KRS (merah), beserta tanggal masuk dan paviliun.",
              side: "left" as const,
              align: "start" as const,
            },
          },
          {
            element: "#tour-tab-identitas",
            popover: {
              title: "Tab: Identitas",
              description:
                "Menampilkan data lengkap identitas pasien seperti alamat, kontak darurat, dan informasi MRS.",
              side: "bottom" as const,
              align: "start" as const,
            },
          },
          {
            element: "#tour-btn-edit-identitas",
            popover: {
              title: "Edit Identitas",
              description:
                "Klik tombol ini untuk mengubah data identitas pasien seperti nama, alamat, dokter, atau diagnosa masuk.",
              side: "bottom" as const,
              align: "end" as const,
            },
          },
          {
            element: "#tour-tab-asesmen",
            popover: {
              title: "Tab: Asesmen Awal",
              description:
                "Formulir asesmen keperawatan awal — meliputi riwayat penyakit, alergi, dan kondisi umum saat masuk.",
              side: "bottom" as const,
              align: "start" as const,
            },
          },
          {
            element: "#tour-tab-cppt",
            popover: {
              title: "Tab: Timbang Terima",
              description:
                "Catatan perkembangan pasien (CPPT) per shift. Isi subjektif, objektif, assessment, dan planning.",
              side: "bottom" as const,
              align: "start" as const,
            },
          },
          {
            element: "#tour-tab-observasi",
            popover: {
              title: "Tab: Observasi & Tindakan",
              description:
                "Catat tanda-tanda vital pasien secara berkala: tensi, nadi, suhu, SPO2, EWS, dan balans cairan.",
              side: "bottom" as const,
              align: "start" as const,
            },
          },
          {
            element: "#tour-tab-lab",
            popover: {
              title: "Tab: Hasil Lab",
              description:
                "Unggah dan lihat hasil pemeriksaan laboratorium pasien dalam format PDF atau gambar.",
              side: "bottom" as const,
              align: "start" as const,
            },
          },
          {
            element: "#tour-tab-resume",
            popover: {
              title: "Tab: Resume",
              description:
                "Formulir resume keluar pasien — diisi saat pasien akan KRS atau meninggal.",
              side: "bottom" as const,
              align: "start" as const,
            },
          },
          {
            element: "#tour-tab-ai",
            popover: {
              title: "Tab: Ringkasan AI ✨",
              description:
                "Fitur AI yang merangkum kondisi pasien secara otomatis dari seluruh data rekam medis.",
              side: "bottom" as const,
              align: "end" as const,
            },
          },
        ],
      });

      driverObj.drive();
    }, 1000);

    // NOTE: intentionally no cleanup — if we clear the timeout on unmount (Strict Mode),
    // the tour will never start because Strict Mode unmounts and remounts the component.
    // The sessionStorage flag is already cleared so duplicate runs are safe.
  }, []);

  if (!showDone) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[2147483647] px-6"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={() => setShowDone(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-8 flex flex-col items-center gap-4 text-center animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowDone(false)}
          className="absolute top-4 right-4 text-stone-300 hover:text-stone-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-stone-800 font-semibold text-lg">Tur Selesai! 🎉</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Semoga tour ini dapat membantu Anda dalam menggunakan SIGAP!
          </p>
        </div>

        <button
          onClick={() => setShowDone(false)}
          className="mt-2 w-full py-2.5 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 active:scale-95 transition-all duration-200"
        >
          Terima Kasih
        </button>
      </div>
    </div>
  );
}
