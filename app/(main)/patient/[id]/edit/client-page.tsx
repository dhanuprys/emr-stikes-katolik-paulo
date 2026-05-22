"use client";

import { useActionState } from "react";
import { updatePatientAction } from "@/app/actions/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

function formatDateTimeForInput(dateStr: string | Date | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function formatDateForInput(dateStr: string | Date | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function EditPatientClientPage({ patient }: { patient: any }) {
  const updateActionWithId = updatePatientAction.bind(null, patient.id);
  const [state, action, pending] = useActionState(updateActionWithId, undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/patient/${patient.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Identitas Pasien</h1>
          <p className="text-muted-foreground">Perbarui data rekam medis dan informasi diri pasien</p>
        </div>
      </div>

      <form action={action}>
        <div className="grid gap-6 md:grid-cols-2">
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800">Identitas Rekam Medis</CardTitle>
              <CardDescription>Informasi registrasi rumah sakit</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noRegMrs">No Reg MRS <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                  <Input id="noRegMrs" name="noRegMrs" required defaultValue={patient.noRegMrs}  className="bg-white" />
                  {state?.errors?.noRegMrs && <p className="text-sm text-destructive">{state.errors.noRegMrs[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noRm">No. RM <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                  <Input id="noRm" name="noRm" required defaultValue={patient.noRm}  className="bg-white" />
                  {state?.errors?.noRm && <p className="text-sm text-destructive">{state.errors.noRm[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paviliun">Paviliun <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                  <Input id="paviliun" name="paviliun" required defaultValue={patient.paviliun}  className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelas">Kelas <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                  <Input id="kelas" name="kelas" required defaultValue={patient.kelas}  className="bg-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tanggalMasuk">Tanggal Masuk <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                <DatePicker id="tanggalMasuk" name="tanggalMasuk" withTime  required defaultValue={formatDateTimeForInput(patient.tanggalMasuk)}  className="bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggalKeluar" className="text-slate-600 font-semibold">Tanggal Keluar (Opsional)</Label>
                  <DatePicker id="tanggalKeluar" name="tanggalKeluar" withTime  defaultValue={formatDateTimeForInput(patient.tanggalKeluar)}  className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalMeninggal" className="text-slate-600 font-semibold">Tanggal Meninggal (Opsional)</Label>
                  <DatePicker id="tanggalMeninggal" name="tanggalMeninggal" withTime  defaultValue={formatDateTimeForInput(patient.tanggalMeninggal)}  className="bg-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asalPasien">Asal Pasien <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                  <Input id="asalPasien" name="asalPasien" required defaultValue={patient.asalPasien}  className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biaya">Biaya <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                  <Input id="biaya" name="biaya" required defaultValue={patient.biaya}  className="bg-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Asal MRS <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white/60">
                  <label className="clinical-control-label"><input type="radio" name="asalMrs" value="Poli" required defaultChecked={patient.asalMrs === "Poli"} className="clinical-radio" /> Poli</label>
                  <label className="clinical-control-label"><input type="radio" name="asalMrs" value="IGD" defaultChecked={patient.asalMrs === "IGD"} className="clinical-radio" /> IGD</label>
                  <label className="clinical-control-label"><input type="radio" name="asalMrs" value="Praktek" defaultChecked={patient.asalMrs === "Praktek"} className="clinical-radio" /> Praktek</label>
                  <label className="clinical-control-label"><input type="radio" name="asalMrs" value="Admission" defaultChecked={patient.asalMrs === "Admission"} className="clinical-radio" /> Admission</label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800">Identitas Pasien</CardTitle>
              <CardDescription>Data diri lengkap pasien</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                <Input id="nama" name="nama" required defaultValue={patient.nama}  className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                <Textarea id="alamat" name="alamat" required defaultValue={patient.alamat}  className="bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="kota">Kota <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="kota" name="kota" required defaultValue={patient.kota}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="provinsi">Provinsi <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="provinsi" name="provinsi" required defaultValue={patient.provinsi}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="noTelp">No. Telp <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="noTelp" name="noTelp" required defaultValue={patient.noTelp}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="tanggalLahir">Tanggal Lahir <span className="text-destructive text-slate-600 font-semibold">*</span></Label><DatePicker id="tanggalLahir" name="tanggalLahir"  required defaultValue={formatDateForInput(patient.tanggalLahir)}  className="bg-white" /></div>
                <div className="space-y-2">
                  <Label>Gender <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                  <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white/60">
                    <label className="clinical-control-label"><input type="radio" name="gender" value="L" required defaultChecked={patient.gender === "L"} className="clinical-radio" /> Laki-laki</label>
                    <label className="clinical-control-label"><input type="radio" name="gender" value="P" defaultChecked={patient.gender === "P"} className="clinical-radio" /> Perempuan</label>
                  </div>
                </div>
                <div className="space-y-2"><Label htmlFor="umur">Umur <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="umur" name="umur" required defaultValue={patient.umur}  className="bg-white" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="bangsa">Bangsa <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="bangsa" name="bangsa" required defaultValue={patient.bangsa}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="agama">Agama <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="agama" name="agama" required defaultValue={patient.agama}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="pendidikan">Pendidikan <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="pendidikan" name="pendidikan" required defaultValue={patient.pendidikan}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="pekerjaan">Pekerjaan <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="pekerjaan" name="pekerjaan" required defaultValue={patient.pekerjaan}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="statusPernikahan" className="text-slate-600 font-semibold">Status Pernikahan</Label><Input id="statusPernikahan" name="statusPernikahan" defaultValue={patient.statusPernikahan || ""}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="namaSuamiIstri" className="text-slate-600 font-semibold">Nama Suami/Istri</Label><Input id="namaSuamiIstri" name="namaSuamiIstri" defaultValue={patient.namaSuamiIstri || ""}  className="bg-white" /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800">Data Keluarga & Dokter</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="namaAyah">Nama Ayah</Label><Input id="namaAyah" name="namaAyah" defaultValue={patient.namaAyah}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="namaIbu">Nama Ibu</Label><Input id="namaIbu" name="namaIbu" defaultValue={patient.namaIbu}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="noRmIbu">No RM Ibu</Label><Input id="noRmIbu" name="noRmIbu" defaultValue={patient.noRmIbu}  className="bg-white" /></div>
                <div className="space-y-2"><Label htmlFor="pekerjaanIbu">Pekerjaan Ibu</Label><Input id="pekerjaanIbu" name="pekerjaanIbu" defaultValue={patient.pekerjaanIbu}  className="bg-white" /></div>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-4">Kontak Darurat</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="daruratNama">Nama <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="daruratNama" name="daruratNama" required defaultValue={patient.daruratNama}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="daruratHubungan">Hubungan <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="daruratHubungan" name="daruratHubungan" required defaultValue={patient.daruratHubungan}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="daruratTelepon">Telepon <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="daruratTelepon" name="daruratTelepon" required defaultValue={patient.daruratTelepon}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="daruratAlamat">Alamat <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Textarea id="daruratAlamat" name="daruratAlamat" required defaultValue={patient.daruratAlamat}  className="bg-white" /></div>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-4">Dokter Penanggung Jawab</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="dokter1">Dokter I <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Input id="dokter1" name="dokter1" required defaultValue={patient.dokter1}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="dokter2" className="text-slate-600 font-semibold">Dokter II (Opsional)</Label><Input id="dokter2" name="dokter2" defaultValue={patient.dokter2 || ""}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="dokter3" className="text-slate-600 font-semibold">Dokter III (Opsional)</Label><Input id="dokter3" name="dokter3" defaultValue={patient.dokter3 || ""}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="dokter4" className="text-slate-600 font-semibold">Dokter IV (Opsional)</Label><Input id="dokter4" name="dokter4" defaultValue={patient.dokter4 || ""}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="dokter5" className="text-slate-600 font-semibold">Dokter V (Opsional)</Label><Input id="dokter5" name="dokter5" defaultValue={patient.dokter5 || ""}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="dokter6" className="text-slate-600 font-semibold">Dokter VI (Opsional)</Label><Input id="dokter6" name="dokter6" defaultValue={patient.dokter6 || ""}  className="bg-white" /></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800">Diagnosa & Medis</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6 space-y-4">
              <div className="space-y-2">
                <Label>Jenis Kasus <span className="text-destructive text-slate-600 font-semibold">*</span></Label>
                <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white/60">
                  <label className="clinical-control-label"><input type="radio" name="jenisKasus" value="bedah" required defaultChecked={patient.jenisKasus === "bedah"} className="clinical-radio" /> Bedah</label>
                  <label className="clinical-control-label"><input type="radio" name="jenisKasus" value="penyakit dalam" defaultChecked={patient.jenisKasus === "penyakit dalam"} className="clinical-radio" /> Penyakit Dalam</label>
                </div>
              </div>
              <div className="space-y-2"><Label htmlFor="diagnosaMasuk">Diagnosa Masuk <span className="text-destructive text-slate-600 font-semibold">*</span></Label><Textarea id="diagnosaMasuk" name="diagnosaMasuk" required defaultValue={patient.diagnosaMasuk}  className="bg-white" /></div>
              
              <div className="border-t pt-4 mt-4 opacity-75">
                <h4 className="font-medium mb-4 text-muted-foreground">Bagian Keluar (Diisi saat KRS)</h4>
                <div className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="diagnosaKeluar" className="text-slate-600 font-semibold">Diagnosa Keluar</Label><Textarea id="diagnosaKeluar" name="diagnosaKeluar" defaultValue={patient.diagnosaKeluar || ""}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="diagnosaUtama" className="text-slate-600 font-semibold">Diagnosa Utama</Label><Textarea id="diagnosaUtama" name="diagnosaUtama" defaultValue={patient.diagnosaUtama || ""}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="diagnosaTambahan" className="text-slate-600 font-semibold">Diagnosa Tambahan</Label><Textarea id="diagnosaTambahan" name="diagnosaTambahan" defaultValue={patient.diagnosaTambahan || ""}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="diagnosaKomplikasi" className="text-slate-600 font-semibold">Diagnosa Komplikasi</Label><Textarea id="diagnosaKomplikasi" name="diagnosaKomplikasi" defaultValue={patient.diagnosaKomplikasi || ""}  className="bg-white" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="penyebabTrauma" className="text-slate-600 font-semibold">Penyebab Trauma</Label><Input id="penyebabTrauma" name="penyebabTrauma" defaultValue={patient.penyebabTrauma || ""}  className="bg-white" /></div>
                    <div className="space-y-2"><Label htmlFor="hasilPerawatan" className="text-slate-600 font-semibold">Hasil Perawatan</Label><Input id="hasilPerawatan" name="hasilPerawatan" defaultValue={patient.hasilPerawatan || ""}  className="bg-white" /></div>
                    <div className="space-y-2"><Label htmlFor="caraKeluar" className="text-slate-600 font-semibold">Cara Keluar</Label><Input id="caraKeluar" name="caraKeluar" defaultValue={patient.caraKeluar || ""}  className="bg-white" /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="operasiTindakan1" className="text-slate-600 font-semibold">Operasi/Tindakan I</Label><Input id="operasiTindakan1" name="operasiTindakan1" defaultValue={patient.operasiTindakan1 || ""}  className="bg-white" /></div>
                  <div className="space-y-2"><Label htmlFor="operasiTindakan2" className="text-slate-600 font-semibold">Operasi/Tindakan II</Label><Input id="operasiTindakan2" name="operasiTindakan2" defaultValue={patient.operasiTindakan2 || ""}  className="bg-white" /></div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {state?.message && (
          <div className="mt-6 bg-destructive/15 text-destructive p-4 rounded-md">
            {state.message}
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href={`/patient/${patient.id}`}>Batal</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Menyimpan..." : "Update Data Pasien"}
          </Button>
        </div>
      </form>
    </div>
  );
}
