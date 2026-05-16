import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Stethoscope, FileText, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PatientTabs } from "./patient-tabs";

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

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{patient.nama}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                  <span className="font-mono bg-white/50 px-2 py-0.5 rounded text-foreground">RM: {patient.noRm}</span>
                  <span>{patient.gender === "L" ? "Laki-laki" : "Perempuan"}, {patient.umur}</span>
                  <span>Tgl Lahir: {formatDate(patient.tanggalLahir)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Status:</span>
                {patient.tanggalKeluar ? (
                  <Badge variant="secondary">Keluar ({formatDate(patient.tanggalKeluar)})</Badge>
                ) : (
                  <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Dirawat</Badge>
                )}
              </div>
              <div>Masuk: {formatDate(patient.tanggalMasuk)}</div>
              <div>Paviliun: {patient.paviliun} ({patient.kelas})</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PatientTabs patientId={patient.id} />
      
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
