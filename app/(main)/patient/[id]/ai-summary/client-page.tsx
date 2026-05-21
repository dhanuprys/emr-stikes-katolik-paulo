"use client";

import { useState, useTransition, useEffect } from "react";
import { generateAiSummaryAction } from "@/app/actions/ai-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Clock, Bot, AlertTriangle, CheckCircle2 } from "lucide-react";
import Markdown from "./markdown-renderer";

function LoadingState({ isApiDone }: { isApiDone?: boolean }) {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [step, setStep] = useState(0);
  const steps = [
    "Mengumpulkan data rekam medis...",
    "Membaca asesmen awal medis & keperawatan...",
    "Menganalisis catatan harian Catatan Timbang Terima...",
    "Mengidentifikasi prioritas masalah klinis...",
    "Menyusun ringkasan terstruktur...",
    "Melakukan finalisasi menggunakan AI...",
  ];

  useEffect(() => {
    // Switch to skeleton after 2.5 seconds
    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(true);
    }, 2500);

    const interval = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 3000);

    return () => {
      clearTimeout(skeletonTimer);
      clearInterval(interval);
    };
  }, [steps.length]);

  return (
    <Card className="border-dashed overflow-hidden relative shadow-sm">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-50/50 via-white to-emerald-50/50 animate-pulse" />

      <CardContent className="py-16 flex flex-col items-center justify-center min-h-[700px] relative z-10 overflow-hidden">

        {/* Phase 1: Initial Bot Animation */}
        <div className={`flex flex-col items-center absolute transition-all duration-700 ease-in-out ${showSkeleton ? 'opacity-0 scale-90 pointer-events-none blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-200 animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-indigo-300 animate-ping opacity-20" />
            <div className="absolute inset-4 rounded-full bg-linear-to-tr from-emerald-500 to-emerald-400 shadow-[0_0_30px_rgba(139,92,246,0.5)] animate-pulse" />

            <Bot className="h-10 w-10 text-white relative z-10 animate-bounce" />

            <Sparkles className="absolute top-0 right-2 h-5 w-5 text-yellow-400 animate-[bounce_2s_ease-in-out_infinite_0.2s]" />
            <Sparkles className="absolute bottom-2 left-0 h-4 w-4 text-yellow-300 animate-[bounce_2.5s_ease-in-out_infinite_0.5s]" />
            <Sparkles className="absolute top-6 left-1 h-3 w-3 text-yellow-200 animate-[ping_3s_ease-in-out_infinite_1s]" />
          </div>
          <h3 className="text-xl font-bold bg-linear-to-r from-emerald-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
            Inisialisasi AI...
          </h3>
        </div>

        {/* Phase 2: Skeleton + Progress Text */}
        <div className={`flex flex-col items-center w-full max-w-3xl absolute transition-all duration-1000 ease-out delay-300 ${showSkeleton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>

          {/* Skeleton Document */}
          <div className="w-full bg-white/70 border border-emerald-100 rounded-xl p-8 shadow-sm text-left relative overflow-hidden mb-8">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent z-10" />

            <div className="h-6 w-2/5 bg-slate-200 rounded-md animate-pulse mb-6" />
            <div className="space-y-3 mb-8">
              <div className="h-4 w-full bg-slate-200 rounded-md animate-pulse" />
              <div className="h-4 w-11/12 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-4 w-full bg-slate-200 rounded-md animate-pulse" />
              <div className="h-4 w-4/5 bg-slate-200 rounded-md animate-pulse" />
            </div>

            <div className="h-6 w-1/3 bg-slate-200 rounded-md animate-pulse mb-4" />
            <div className="space-y-3 pl-4 border-l-4 border-slate-100">
              <div className="h-4 w-3/4 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-4 w-2/3 bg-slate-200 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Progress Text below skeleton */}
          <div className="space-y-2 text-center w-full">
            <h3 className="text-lg font-bold bg-linear-to-r from-emerald-600 to-emerald-600 bg-clip-text text-transparent h-8 flex items-center justify-center animate-pulse gap-2">
              {isApiDone ? "Ringkasan dibuat" : steps[step]}
              {isApiDone && <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in zoom-in" />}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {isApiDone ? "Berhasil menyelesaikan analisis." : "Gemini AI memproses puluhan parameter medis untuk keakuratan tinggi."}
            </p>
          </div>

        </div>

      </CardContent>
    </Card>
  );
}

export function AiSummaryClient({
  patientId,
  initialSummary,
}: {
  patientId: string;
  initialSummary: any | null;
}) {
  const [summary, setSummary] = useState(initialSummary);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isApiDone, setIsApiDone] = useState(false);

  const handleGenerate = () => {
    setError(null);
    setIsApiDone(false);
    startTransition(async () => {
      // Minimum animation threshold (6.5 seconds) to ensure sequential animation plays nicely
      // Phase 1 (bot) is 2.5s, Phase 2 (skeleton) will play for at least 4s
      const minWaitPromise = new Promise((resolve) => setTimeout(resolve, 6500));
      const resultPromise = generateAiSummaryAction(patientId);

      // Wait for both the API to finish AND the threshold timer
      const [result] = await Promise.all([resultPromise, minWaitPromise]);

      setIsApiDone(true);
      // Wait 1.5s so user can read "Ringkasan dibuat ✅"
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (result.error) {
        setError(result.error);
      } else if (result.summary) {
        setSummary(result.summary);
      }
      setIsApiDone(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Ringkasan AI
          </h2>
          <p className="text-sm text-muted-foreground">
            Analisis klinis komprehensif menggunakan kecerdasan buatan
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="bg-gradient-to-r from-emerald-600 to-emerald-600 hover:from-emerald-700 hover:to-emerald-700 text-white shadow-lg"
        >
          {isPending ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Menganalisis Data...
            </>
          ) : summary ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Perbarui Ringkasan
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Buat Ringkasan AI
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-3 border border-destructive/20">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Gagal membuat ringkasan</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {isPending && <LoadingState isApiDone={isApiDone} />}

      {!summary && !isPending && (
        <Card className="border-dashed">
          <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Belum ada ringkasan AI</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Klik tombol <strong>"Buat Ringkasan AI"</strong> untuk menganalisis data asesmen awal dan informasi timang terima pasien secara otomatis menggunakan kecerdasan buatan.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {summary && !isPending && (
        <Card className="overflow-hidden border-emerald-100 shadow-sm">
          <CardContent className="p-0 transition-opacity duration-500">

            {/* Minimal top bar for date and model only */}
            <div className="flex justify-between items-center bg-slate-50/80 border-b px-6 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Clock className="h-4 w-4" />
                Terakhir Diperbarui: {new Date(summary.createdAt).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Markdown Content */}
            <div className="p-6 md:p-8">
              <Markdown content={summary.content} />
            </div>
          </CardContent>
        </Card>
      )}

      {summary && !isPending && (
        <p className="text-xs text-muted-foreground text-center">
          ⚠️ Ringkasan ini dihasilkan oleh AI dan bersifat sebagai alat bantu. Seluruh keputusan klinis tetap menjadi tanggung jawab dokter dan perawat yang merawat.
        </p>
      )}
    </div>
  );
}
