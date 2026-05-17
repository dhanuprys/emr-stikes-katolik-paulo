"use client";

import { useActionState, useEffect, useState } from "react";
import { saveCpptAction, checkCpptExistsAction, getCpptByIdAction } from "@/app/actions/cppt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Info } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export default function NewCpptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const searchParams = useSearchParams();
  const editIdParam = searchParams.get("edit");

  const [patientId, setPatientId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [tanggal, setTanggal] = useState("");
  const [waktu, setWaktu] = useState("");
  const [subjektif, setSubjektif] = useState("");
  const [objektif, setObjektif] = useState("");
  const [assessment, setAssessment] = useState("");
  const [planning, setPlanning] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    params.then((p) => setPatientId(p.id));
  }, [params]);

  // Load via Edit ID if present
  useEffect(() => {
    if (editIdParam) {
      setIsLoading(true);
      getCpptByIdAction(editIdParam).then((res) => {
        if (res) {
          setEditingId(res.id);
          // Adjust datetime string for input format
          const d = new Date(res.tanggal);
          d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
          setTanggal(d.toISOString().slice(0, 16));
          
          setWaktu(res.waktu);
          setSubjektif(res.subjektif);
          setObjektif(res.objektif);
          setAssessment(res.assessment);
          setPlanning(res.planning);
        }
        setIsLoading(false);
      });
    } else {
      // Default datetime
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setTanggal(now.toISOString().slice(0, 16));
    }
  }, [editIdParam]);

  // Auto-check if CPPT exists for selected Date + Waktu
  useEffect(() => {
    if (!patientId || !tanggal || !waktu || editIdParam) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const existing = await checkCpptExistsAction(patientId, tanggal, waktu);
      if (existing) {
        setEditingId(existing.id);
        setSubjektif(existing.subjektif);
        setObjektif(existing.objektif);
        setAssessment(existing.assessment);
        setPlanning(existing.planning);
      } else {
        setEditingId(null);
        // Don't reset textareas automatically to avoid losing user input if they just changed the shift
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [tanggal, waktu, patientId, editIdParam]);

  // Bind to action
  const actionWithIds = saveCpptAction.bind(null, patientId, editingId);
  const [state, action, pending] = useActionState(actionWithIds, undefined);

  if (!patientId) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{editingId ? "Edit CPPT" : "Tambah CPPT Baru"}</h2>
          <p className="text-sm text-muted-foreground">Isi catatan perkembangan menggunakan format SOAP</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/patient/${patientId}/cppt`}>Kembali</Link>
        </Button>
      </div>

      <form action={action}>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex justify-between items-center text-slate-800">
              Informasi Waktu
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-6 px-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal & Waktu <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                <DatePicker 
                  id="tanggal" 
                  name="tanggal" 
                  withTime 
                  required 
                  value={tanggal}
                  onChange={(val) => setTanggal(val)}
                />
                {state?.errors?.tanggal && <p className="text-sm text-destructive">{state.errors.tanggal[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label>Shift Waktu <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white/60">
                  <label className="clinical-control-label"><input type="radio" name="waktu" value="Pagi" required checked={waktu === "Pagi"} onChange={(e) => setWaktu(e.target.value)} className="clinical-radio" /> Pagi</label>
                  <label className="clinical-control-label"><input type="radio" name="waktu" value="Siang" checked={waktu === "Siang"} onChange={(e) => setWaktu(e.target.value)} className="clinical-radio" /> Siang</label>
                  <label className="clinical-control-label"><input type="radio" name="waktu" value="Malam" checked={waktu === "Malam"} onChange={(e) => setWaktu(e.target.value)} className="clinical-radio" /> Malam</label>
                </div>
                {state?.errors?.waktu && <p className="text-sm text-destructive">{state.errors.waktu[0]}</p>}
              </div>
            </div>
            
            {editingId && !editIdParam && (
              <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm flex gap-2 items-center">
                <Info className="h-4 w-4" /> 
                <span>CPPT untuk shift ini sudah ada. Mengedit data yang sudah ada.</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-l-4 border-l-primary relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-800">SOAP</CardTitle>
            <CardDescription>Subjektif, Objektif, Assessment, Planning</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-6 px-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subjektif" className="text-base text-slate-600 font-semibold">S - Subjektif <span className="text-destructive">*</span></Label>
              <Textarea id="subjektif" name="subjektif" required className="h-24 bg-white" value={subjektif} onChange={(e) => setSubjektif(e.target.value)} />
              {state?.errors?.subjektif && <p className="text-sm text-destructive">{state.errors.subjektif[0]}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objektif" className="text-base text-slate-600 font-semibold">O - Objektif <span className="text-destructive">*</span></Label>
              <Textarea id="objektif" name="objektif" required className="h-24 bg-white" value={objektif} onChange={(e) => setObjektif(e.target.value)} />
              {state?.errors?.objektif && <p className="text-sm text-destructive">{state.errors.objektif[0]}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assessment" className="text-base text-slate-600 font-semibold">A - Assessment <span className="text-destructive">*</span></Label>
              <Textarea id="assessment" name="assessment" required className="h-20 bg-white" value={assessment} onChange={(e) => setAssessment(e.target.value)} />
              {state?.errors?.assessment && <p className="text-sm text-destructive">{state.errors.assessment[0]}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="planning" className="text-base text-slate-600 font-semibold">P - Planning <span className="text-destructive">*</span></Label>
              <Textarea id="planning" name="planning" required className="h-24 bg-white" value={planning} onChange={(e) => setPlanning(e.target.value)} />
              {state?.errors?.planning && <p className="text-sm text-destructive">{state.errors.planning[0]}</p>}
            </div>
          </CardContent>
        </Card>

        {state?.message && (
          <div className="mt-6 bg-destructive/15 text-destructive p-4 rounded-md text-sm">
            {state.message}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg" disabled={pending || isLoading} className="w-full sm:w-auto">
            {pending ? "Menyimpan..." : (editingId ? "Update CPPT" : "Simpan CPPT")}
          </Button>
        </div>
      </form>
    </div>
  );
}
