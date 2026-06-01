"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { saveResumeAction, getResumeAction } from "@/app/actions/resume";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, Plus, Trash2, CalendarClock } from "lucide-react";
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jadwalKontrol",
  });

  useEffect(() => { params.then(p => setPatientId(p.id)); }, [params]);

  // Load existing data
  useEffect(() => {
    if (!patientId || hasLoadedRef.current) return;

    getResumeAction(patientId).then((res) => {
      if (res && res.data) {
        const loadedData = res.data as any;
        // Ensure jadwalKontrol is always an array
        if (!Array.isArray(loadedData.jadwalKontrol)) {
          // Migrate old single tanggalKontrol if it exists
          if (loadedData.tanggalKontrol) {
            loadedData.jadwalKontrol = [
              { tanggal: loadedData.tanggalKontrol, dokter: "", alamat: "" }
            ];
          } else {
            loadedData.jadwalKontrol = [];
          }
        }
        reset(loadedData);
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

        {/* Jadwal Kontrol Section */}
        <Card className="shadow-sm border-t-4 border-t-amber-400">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-amber-500" />
                  Jadwal Kontrol
                </CardTitle>
                <CardDescription className="mt-1">Jadwal kontrol pasien setelah KRS. Klik &quot;Tambah&quot; untuk menambahkan jadwal baru.</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ tanggal: "", dokter: "", alamat: "" })}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" /> Tambah
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-6 px-6">
            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
                Belum ada jadwal kontrol. Klik &quot;Tambah&quot; untuk menambahkan.
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="relative p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        Kontrol #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-7 w-7 p-0 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus jadwal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Tanggal & Jam</Label>
                        <Input
                          type="datetime-local"
                          {...register(`jadwalKontrol.${index}.tanggal`)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Dokter</Label>
                        <Input
                          type="text"
                          placeholder="Nama dokter"
                          {...register(`jadwalKontrol.${index}.dokter`)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Alamat / Tempat Kontrol</Label>
                        <Input
                          type="text"
                          placeholder="Alamat atau tempat kontrol"
                          {...register(`jadwalKontrol.${index}.alamat`)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
