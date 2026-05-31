import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Stethoscope, FileText, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PatientTabs } from "./patient-tabs";
import { AvatarUpload } from "@/components/patient/avatar-upload";
import { PatientDetailTour } from "@/components/dashboard/patient-detail-tour";
import { getDefaultAvatar } from "@/lib/avatar";

export default async function PatientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detail Pasien</h1>
        </div>
      </div>

      <Card id="tour-patient-header" className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex gap-4 items-start w-full md:w-3/4">
              <div id="tour-patient-avatar">
                <AvatarUpload 
                  patientId={patient.id} 
                  customPhotoUrl={patient.photo} 
                  defaultPhotoUrl={getDefaultAvatar(patient.gender, patient.umur)} 
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">{patient.nama}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                  <span className="font-mono bg-white/60 px-2 py-0.5 rounded text-slate-700 font-medium border border-primary/10">RM: {patient.noRm}</span>
                  <span>{patient.gender === "L" ? "Laki-laki" : "Perempuan"}, {patient.umur}</span>
                  <span>Tgl Lahir: {formatDate(patient.tanggalLahir)}</span>
                </div>
                
                {(patient.dokter1 || patient.diagnosaMasuk) && (
                  <div className="mt-3 flex flex-col gap-1.5 text-sm bg-white/40 p-3 rounded-lg border border-primary/10">
                    {patient.dokter1 && (
                      <div className="flex items-start gap-2">
                        <Stethoscope className="h-4 w-4 mt-0.5 text-primary/70 shrink-0" />
                        <span className="text-slate-700 font-medium">DPJP: {[patient.dokter1, patient.dokter2, patient.dokter3, patient.dokter4, patient.dokter5, patient.dokter6].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                    {patient.diagnosaMasuk && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 mt-0.5 text-primary/70 shrink-0" />
                        <span className="text-slate-600 italic line-clamp-2" title={patient.diagnosaMasuk}>
                          <span className="font-medium not-italic text-slate-700 mr-1">Diagnosa Masuk:</span> 
                          {patient.diagnosaMasuk}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div id="tour-patient-status" className="flex flex-col md:items-end gap-2 text-sm text-muted-foreground bg-white/40 p-3 rounded-lg border border-primary/10 md:bg-transparent md:border-none md:p-0 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span>Status:</span>
                {patient.tanggalKeluar ? (
                  <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">KRS ({formatDate(patient.tanggalKeluar)})</Badge>
                ) : (
                  <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Dirawat</Badge>
                )}
              </div>
              <div>Masuk: {formatDate(patient.tanggalMasuk)}</div>
              <div>Paviliun: <span className="font-medium text-slate-700">{patient.paviliun}</span> ({patient.kelas})</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PatientDetailTour />
      <PatientTabs patientId={patient.id} />
      
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
