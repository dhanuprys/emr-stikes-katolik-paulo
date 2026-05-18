"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { saveResumeAction, getResumeAction } from "@/app/actions/resume";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";
import { resumeSections, buildResumeDefaults } from "@/lib/resume-fields";
import { FieldRenderer } from "@/components/assessment/field-renderer";

export default function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [patientId, setPatientId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasLoadedRef = useRef(false);

  const { register, watch, control, reset } = useForm<any>({
    defaultValues: {
      ...buildResumeDefaults(),
    },
  });

  useEffect(() => { params.then(p => setPatientId(p.id)); }, [params]);

  // Load existing data
  useEffect(() => {
    if (!patientId || hasLoadedRef.current) return;

    getResumeAction(patientId).then((res) => {
      if (res && res.data) {
        reset(res.data as any);
      }
      setIsInitialLoad(false);
      hasLoadedRef.current = true;
    });
  }, [patientId, reset]);

  // Autosave with debounce
  useEffect(() => {
    if (!patientId || isInitialLoad) return;
    
    const sub = watch((value) => {
      const t = setTimeout(() => {
        startTransition(async () => {
          const r = await saveResumeAction(patientId, value);
          if (r.success) setLastSaved(new Date());
        });
      }, 2000);
      return () => clearTimeout(t);
    });
    return () => sub.unsubscribe();
  }, [watch, patientId, isInitialLoad]);

  return (
    <div className="space-y-6 pb-12 relative">
      {isInitialLoad && (
        <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Memuat data...</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Resume Perawatan Pasien Pulang</h2>
        <p className="text-sm text-muted-foreground mt-1">Isi ringkasan perawatan di bawah ini. Sistem akan menyimpan perubahan secara otomatis.</p>
      </div>

      {/* Floating Autosave Indicator */}
      <div className="fixed bottom-6 right-6 z-50 bg-background/80 backdrop-blur-md shadow-lg border rounded-full px-4 py-2.5 flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
        {isPending ? (
          <span className="text-amber-500 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</span>
        ) : lastSaved ? (
          <span className="text-emerald-600 flex items-center gap-2"><Check className="h-4 w-4" /> Tersimpan {lastSaved.toLocaleTimeString()}</span>
        ) : (
          <span className="text-muted-foreground flex items-center gap-2">Siap menyimpan otomatis...</span>
        )}
      </div>

      <form className="space-y-8">
        {/* Render all resume sections */}
        {resumeSections.map((section, si) => (
          <Card key={si} className={`shadow-sm ${si === 0 ? "border-t-4 border-t-primary" : ""}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800">{section.title}</CardTitle>
              {section.description && <CardDescription>{section.description}</CardDescription>}
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {section.fields.map((field) => {
                  const span = field.type === "textarea" ? "md:col-span-2" : "";
                  return (
                    <div key={field.key} className={span}>
                      <FieldRenderer field={field} register={register} control={control} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </form>
    </div>
  );
}
