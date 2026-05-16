"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { saveAssessmentAction, getAssessmentAction } from "@/app/actions/assessment";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Plus, Trash2, FileDown } from "lucide-react";
import { assessmentSections, buildDefaults } from "@/lib/assessment-fields";
import { FieldRenderer } from "@/components/assessment/field-renderer";

export default function AssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [patientId, setPatientId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasLoadedRef = useRef(false);

  const { register, watch, control, reset } = useForm({
    defaultValues: {
      ...buildDefaults(),
      // Dynamic arrays for Diagnosa Keperawatan
      diagnosaKep: [{ diagnosa: "", etiologi: "", prioritas: "" }],
      rencanaKep: [{ dp: "", tujuan: "", kriteria: "" }],
      intervensiKep: [{ dp: "", mandiri: "", kolaborasi: "", edukasi: [] as string[], edukasiLain: "" }],
    },
  });

  const { fields: dxFields, append: addDx, remove: rmDx } = useFieldArray({ control, name: "diagnosaKep" });
  const { fields: rkFields, append: addRk, remove: rmRk } = useFieldArray({ control, name: "rencanaKep" });
  const { fields: ivFields, append: addIv, remove: rmIv } = useFieldArray({ control, name: "intervensiKep" });

  useEffect(() => { params.then(p => setPatientId(p.id)); }, [params]);

  // Load existing data
  useEffect(() => {
    if (!patientId || hasLoadedRef.current) return;

    getAssessmentAction(patientId).then((res) => {
      if (res && res.data) {
        // Restore from DB
        reset(res.data as any);
      }
      setIsInitialLoad(false);
      hasLoadedRef.current = true;
    });
  }, [patientId, reset]);

  // Autosave with debounce
  useEffect(() => {
    // Prevent autosaving before initial load completes
    if (!patientId || isInitialLoad) return;
    
    const sub = watch((value) => {
      const t = setTimeout(() => {
        startTransition(async () => {
          const r = await saveAssessmentAction(patientId, value);
          if (r.success) setLastSaved(new Date());
        });
      }, 2000);
      return () => clearTimeout(t);
    });
    return () => sub.unsubscribe();
  }, [watch, patientId, isInitialLoad]);

  const edukasiOptions = ["Rencana keperawatan","Proses penyakit","Terapi/obat","Penggunaan alat medis","Manajemen nyeri","Lain-lain"];

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
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">Asesmen Awal Medis & Keperawatan</h2>
          <p className="text-sm text-muted-foreground mt-1">Isi formulir asesmen di bawah ini. Sistem akan menyimpan perubahan secara otomatis.</p>
        </div>
        {patientId && (
          <Button variant="outline" onClick={() => window.open(`/print/assessment/${patientId}`, '_blank')}>
            <FileDown className="h-4 w-4 mr-2" /> Cetak PDF
          </Button>
        )}
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

        {/* Render all data-driven sections */}
        {assessmentSections.map((section, si) => (
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

        {/* ===== DIAGNOSA KEPERAWATAN — List 1 ===== */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-800">Diagnosa Keperawatan</CardTitle>
            <CardDescription>Diagnosis, Etiologi, Prioritas</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-6 px-6 space-y-4">
            {dxFields.map((f, i) => (
              <div key={f.id} className="p-5 border rounded-lg bg-slate-50/50 relative group transition-colors hover:bg-slate-50">
                <Button type="button" variant="ghost" size="icon" className="absolute top-3 right-3 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10" onClick={() => rmDx(i)}><Trash2 className="h-4 w-4" /></Button>
                <div className="grid md:grid-cols-3 gap-5 pr-10">
                  <div className="space-y-1.5"><Label className="text-slate-600 font-semibold">Diagnosis Keperawatan</Label><Input {...register(`diagnosaKep.${i}.diagnosa`)} className="bg-white" /></div>
                  <div className="space-y-1.5"><Label className="text-slate-600 font-semibold">Etiologi</Label><Input {...register(`diagnosaKep.${i}.etiologi`)} className="bg-white" /></div>
                  <div className="space-y-1.5"><Label className="text-slate-600 font-semibold">Prioritas</Label><Input {...register(`diagnosaKep.${i}.prioritas`)} className="bg-white" /></div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => addDx({ diagnosa:"", etiologi:"", prioritas:"" })}><Plus className="h-4 w-4 mr-2" /> Tambah Diagnosa</Button>
          </CardContent>
        </Card>

        {/* ===== DIAGNOSA KEPERAWATAN — List 2 (Tujuan) ===== */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-800">Rencana Keperawatan — Tujuan</CardTitle>
            <CardDescription>DP, Tujuan, Kriteria Evaluasi</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-6 px-6 space-y-4">
            {rkFields.map((f, i) => (
              <div key={f.id} className="p-5 border rounded-lg bg-slate-50/50 relative group transition-colors hover:bg-slate-50">
                <Button type="button" variant="ghost" size="icon" className="absolute top-3 right-3 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10" onClick={() => rmRk(i)}><Trash2 className="h-4 w-4" /></Button>
                <div className="grid md:grid-cols-3 gap-5 pr-10">
                  <div className="space-y-1.5"><Label className="text-slate-600 font-semibold">DP</Label><Input {...register(`rencanaKep.${i}.dp`)} className="bg-white" /></div>
                  <div className="space-y-1.5"><Label className="text-slate-600 font-semibold">Tujuan</Label><Input {...register(`rencanaKep.${i}.tujuan`)} className="bg-white" /></div>
                  <div className="space-y-1.5"><Label className="text-slate-600 font-semibold">Kriteria Evaluasi</Label><Input {...register(`rencanaKep.${i}.kriteria`)} className="bg-white" /></div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => addRk({ dp:"", tujuan:"", kriteria:"" })}><Plus className="h-4 w-4 mr-2" /> Tambah Rencana</Button>
          </CardContent>
        </Card>

        {/* ===== DIAGNOSA KEPERAWATAN — List 3 (Intervensi) ===== */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-800">Rencana Keperawatan — Intervensi</CardTitle>
            <CardDescription>DP, Mandiri, Kolaborasi, Edukasi</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-6 px-6 space-y-4">
            {ivFields.map((f, i) => (
              <div key={f.id} className="p-5 border rounded-lg bg-slate-50/50 relative group transition-colors hover:bg-slate-50">
                <Button type="button" variant="ghost" size="icon" className="absolute top-3 right-3 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10" onClick={() => rmIv(i)}><Trash2 className="h-4 w-4" /></Button>
                <div className="grid md:grid-cols-3 gap-5 pr-10">
                  <div className="space-y-1.5"><Label className="text-slate-600 font-semibold">DP</Label><Input {...register(`intervensiKep.${i}.dp`)} className="bg-white" /></div>
                  <div className="space-y-1.5"><Label className="text-slate-600 font-semibold">Mandiri</Label><Input {...register(`intervensiKep.${i}.mandiri`)} className="bg-white" /></div>
                  <div className="space-y-1.5"><Label className="text-slate-600 font-semibold">Kolaborasi</Label><Input {...register(`intervensiKep.${i}.kolaborasi`)} className="bg-white" /></div>
                </div>
                <div className="mt-5 border-t pt-4">
                  <Label className="mb-3 block text-slate-600 font-semibold">Edukasi</Label>
                  <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white/60">
                    {edukasiOptions.map((opt) => (
                      <label key={opt} className="clinical-control-label">
                        <input type="checkbox" value={opt} {...register(`intervensiKep.${i}.edukasi`)} className="clinical-checkbox" />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <Input placeholder="Edukasi lain-lain..." {...register(`intervensiKep.${i}.edukasiLain`)} className="mt-3 bg-white" />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => addIv({ dp:"", mandiri:"", kolaborasi:"", edukasi:[], edukasiLain:"" })}><Plus className="h-4 w-4 mr-2" /> Tambah Intervensi</Button>
          </CardContent>
        </Card>

      </form>
    </div>
  );
}
