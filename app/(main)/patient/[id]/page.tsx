import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit } from "lucide-react";
import { DeletePatientButton } from "@/components/patient/delete-button";
import { DuplicatePatientButton } from "@/components/patient/duplicate-button";

export default async function PatientIdentityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <DuplicatePatientButton id={patient.id} name={patient.nama} />
        <DeletePatientButton id={patient.id} name={patient.nama} />
        <Button id="tour-btn-edit-identitas" variant="outline" asChild>
          <Link href={`/patient/${patient.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" /> Edit Identitas
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identitas Rekam Medis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2"><span className="text-muted-foreground">No Reg MRS:</span><span className="font-medium">{patient.noRegMrs}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Asal Pasien:</span><span className="font-medium">{patient.asalPasien}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Asal MRS:</span><span className="font-medium">{patient.asalMrs}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Biaya:</span><span className="font-medium">{patient.biaya}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Identitas Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Alamat:</span><span className="font-medium">{patient.alamat}, {patient.kota}, {patient.provinsi}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">No. Telp:</span><span className="font-medium">{patient.noTelp}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Bangsa/Agama:</span><span className="font-medium">{patient.bangsa} / {patient.agama}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Pekerjaan:</span><span className="font-medium">{patient.pekerjaan}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Pendidikan:</span><span className="font-medium">{patient.pendidikan}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontak Darurat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Nama:</span><span className="font-medium">{patient.daruratNama} ({patient.daruratHubungan})</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Telepon:</span><span className="font-medium">{patient.daruratTelepon}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Alamat:</span><span className="font-medium">{patient.daruratAlamat}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dokter & Diagnosa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Jenis Kasus:</span><span className="font-medium capitalize">{patient.jenisKasus}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Dokter I:</span><span className="font-medium">{patient.dokter1}</span></div>
            {patient.dokter2 && <div className="grid grid-cols-2"><span className="text-muted-foreground">Dokter II:</span><span className="font-medium">{patient.dokter2}</span></div>}
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Diagnosa Masuk:</span><span className="font-medium">{patient.diagnosaMasuk}</span></div>
            {patient.diagnosaKeluar && <div className="grid grid-cols-2"><span className="text-muted-foreground">Diagnosa Keluar:</span><span className="font-medium">{patient.diagnosaKeluar}</span></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
