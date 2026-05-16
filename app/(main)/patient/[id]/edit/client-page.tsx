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
            <CardHeader>
              <CardTitle>Identitas Rekam Medis</CardTitle>
              <CardDescription>Informasi registrasi rumah sakit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noRegMrs">No Reg MRS <span className="text-destructive">*</span></Label>
                  <Input id="noRegMrs" name="noRegMrs" required defaultValue={patient.noRegMrs} />
                  {state?.errors?.noRegMrs && <p className="text-sm text-destructive">{state.errors.noRegMrs[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noRm">No. RM <span className="text-destructive">*</span></Label>
                  <Input id="noRm" name="noRm" required defaultValue={patient.noRm} />
                  {state?.errors?.noRm && <p className="text-sm text-destructive">{state.errors.noRm[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paviliun">Paviliun <span className="text-destructive">*</span></Label>
                  <Input id="paviliun" name="paviliun" required defaultValue={patient.paviliun} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelas">Kelas <span className="text-destructive">*</span></Label>
                  <Input id="kelas" name="kelas" required defaultValue={patient.kelas} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tanggalMasuk">Tanggal Masuk <span className="text-destructive">*</span></Label>
                <Input id="tanggalMasuk" name="tanggalMasuk" type="datetime-local" required defaultValue={formatDateTimeForInput(patient.tanggalMasuk)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggalKeluar">Tanggal Keluar (Opsional)</Label>
                  <Input id="tanggalKeluar" name="tanggalKeluar" type="datetime-local" defaultValue={formatDateTimeForInput(patient.tanggalKeluar)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalMeninggal">Tanggal Meninggal (Opsional)</Label>
                  <Input id="tanggalMeninggal" name="tanggalMeninggal" type="datetime-local" defaultValue={formatDateTimeForInput(patient.tanggalMeninggal)} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asalPasien">Asal Pasien <span className="text-destructive">*</span></Label>
                  <Input id="asalPasien" name="asalPasien" required defaultValue={patient.asalPasien} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biaya">Biaya <span className="text-destructive">*</span></Label>
                  <Input id="biaya" name="biaya" required defaultValue={patient.biaya} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Asal MRS <span className="text-destructive">*</span></Label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2"><input type="radio" name="asalMrs" value="Poli" required defaultChecked={patient.asalMrs === "Poli"} /> Poli</label>
                  <label className="flex items-center gap-2"><input type="radio" name="asalMrs" value="IGD" defaultChecked={patient.asalMrs === "IGD"} /> IGD</label>
                  <label className="flex items-center gap-2"><input type="radio" name="asalMrs" value="Praktek" defaultChecked={patient.asalMrs === "Praktek"} /> Praktek</label>
                  <label className="flex items-center gap-2"><input type="radio" name="asalMrs" value="Admission" defaultChecked={patient.asalMrs === "Admission"} /> Admission</label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identitas Pasien</CardTitle>
              <CardDescription>Data diri lengkap pasien</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap <span className="text-destructive">*</span></Label>
                <Input id="nama" name="nama" required defaultValue={patient.nama} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat <span className="text-destructive">*</span></Label>
                <Textarea id="alamat" name="alamat" required defaultValue={patient.alamat} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="kota">Kota <span className="text-destructive">*</span></Label><Input id="kota" name="kota" required defaultValue={patient.kota} /></div>
                <div className="space-y-2"><Label htmlFor="provinsi">Provinsi <span className="text-destructive">*</span></Label><Input id="provinsi" name="provinsi" required defaultValue={patient.provinsi} /></div>
                <div className="space-y-2"><Label htmlFor="noTelp">No. Telp <span className="text-destructive">*</span></Label><Input id="noTelp" name="noTelp" required defaultValue={patient.noTelp} /></div>
                <div className="space-y-2"><Label htmlFor="tanggalLahir">Tanggal Lahir <span className="text-destructive">*</span></Label><Input id="tanggalLahir" name="tanggalLahir" type="date" required defaultValue={formatDateForInput(patient.tanggalLahir)} /></div>
                <div className="space-y-2">
                  <Label>Gender <span className="text-destructive">*</span></Label>
                  <div className="flex gap-4 items-center h-10">
                    <label className="flex items-center gap-2"><input type="radio" name="gender" value="L" required defaultChecked={patient.gender === "L"} /> Laki-laki</label>
                    <label className="flex items-center gap-2"><input type="radio" name="gender" value="P" defaultChecked={patient.gender === "P"} /> Perempuan</label>
                  </div>
                </div>
                <div className="space-y-2"><Label htmlFor="umur">Umur <span className="text-destructive">*</span></Label><Input id="umur" name="umur" required defaultValue={patient.umur} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="bangsa">Bangsa <span className="text-destructive">*</span></Label><Input id="bangsa" name="bangsa" required defaultValue={patient.bangsa} /></div>
                <div className="space-y-2"><Label htmlFor="agama">Agama <span className="text-destructive">*</span></Label><Input id="agama" name="agama" required defaultValue={patient.agama} /></div>
                <div className="space-y-2"><Label htmlFor="pendidikan">Pendidikan <span className="text-destructive">*</span></Label><Input id="pendidikan" name="pendidikan" required defaultValue={patient.pendidikan} /></div>
                <div className="space-y-2"><Label htmlFor="pekerjaan">Pekerjaan <span className="text-destructive">*</span></Label><Input id="pekerjaan" name="pekerjaan" required defaultValue={patient.pekerjaan} /></div>
                <div className="space-y-2"><Label htmlFor="statusPernikahan">Status Pernikahan</Label><Input id="statusPernikahan" name="statusPernikahan" defaultValue={patient.statusPernikahan || ""} /></div>
                <div className="space-y-2"><Label htmlFor="namaSuamiIstri">Nama Suami/Istri</Label><Input id="namaSuamiIstri" name="namaSuamiIstri" defaultValue={patient.namaSuamiIstri || ""} /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Keluarga & Dokter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="namaAyah">Nama Ayah <span className="text-destructive">*</span></Label><Input id="namaAyah" name="namaAyah" required defaultValue={patient.namaAyah} /></div>
                <div className="space-y-2"><Label htmlFor="namaIbu">Nama Ibu <span className="text-destructive">*</span></Label><Input id="namaIbu" name="namaIbu" required defaultValue={patient.namaIbu} /></div>
                <div className="space-y-2"><Label htmlFor="noRmIbu">No RM Ibu <span className="text-destructive">*</span></Label><Input id="noRmIbu" name="noRmIbu" required defaultValue={patient.noRmIbu} /></div>
                <div className="space-y-2"><Label htmlFor="pekerjaanIbu">Pekerjaan Ibu <span className="text-destructive">*</span></Label><Input id="pekerjaanIbu" name="pekerjaanIbu" required defaultValue={patient.pekerjaanIbu} /></div>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-4">Kontak Darurat</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="daruratNama">Nama <span className="text-destructive">*</span></Label><Input id="daruratNama" name="daruratNama" required defaultValue={patient.daruratNama} /></div>
                  <div className="space-y-2"><Label htmlFor="daruratHubungan">Hubungan <span className="text-destructive">*</span></Label><Input id="daruratHubungan" name="daruratHubungan" required defaultValue={patient.daruratHubungan} /></div>
                  <div className="space-y-2"><Label htmlFor="daruratTelepon">Telepon <span className="text-destructive">*</span></Label><Input id="daruratTelepon" name="daruratTelepon" required defaultValue={patient.daruratTelepon} /></div>
                  <div className="space-y-2"><Label htmlFor="daruratAlamat">Alamat <span className="text-destructive">*</span></Label><Textarea id="daruratAlamat" name="daruratAlamat" required defaultValue={patient.daruratAlamat} /></div>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-4">Dokter Penanggung Jawab</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="dokter1">Dokter I <span className="text-destructive">*</span></Label><Input id="dokter1" name="dokter1" required defaultValue={patient.dokter1} /></div>
                  <div className="space-y-2"><Label htmlFor="dokter2">Dokter II (Opsional)</Label><Input id="dokter2" name="dokter2" defaultValue={patient.dokter2 || ""} /></div>
                  <div className="space-y-2"><Label htmlFor="dokter3">Dokter III (Opsional)</Label><Input id="dokter3" name="dokter3" defaultValue={patient.dokter3 || ""} /></div>
                  <div className="space-y-2"><Label htmlFor="dokter4">Dokter IV (Opsional)</Label><Input id="dokter4" name="dokter4" defaultValue={patient.dokter4 || ""} /></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diagnosa & Medis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Jenis Kasus <span className="text-destructive">*</span></Label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2"><input type="radio" name="jenisKasus" value="bedah" required defaultChecked={patient.jenisKasus === "bedah"} /> Bedah</label>
                  <label className="flex items-center gap-2"><input type="radio" name="jenisKasus" value="penyakit dalam" defaultChecked={patient.jenisKasus === "penyakit dalam"} /> Penyakit Dalam</label>
                </div>
              </div>
              <div className="space-y-2"><Label htmlFor="diagnosaMasuk">Diagnosa Masuk <span className="text-destructive">*</span></Label><Textarea id="diagnosaMasuk" name="diagnosaMasuk" required defaultValue={patient.diagnosaMasuk} /></div>
              
              <div className="border-t pt-4 mt-4 opacity-75">
                <h4 className="font-medium mb-4 text-muted-foreground">Bagian Keluar (Diisi saat KRS)</h4>
                <div className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="diagnosaKeluar">Diagnosa Keluar</Label><Textarea id="diagnosaKeluar" name="diagnosaKeluar" defaultValue={patient.diagnosaKeluar || ""} /></div>
                  <div className="space-y-2"><Label htmlFor="diagnosaUtama">Diagnosa Utama</Label><Textarea id="diagnosaUtama" name="diagnosaUtama" defaultValue={patient.diagnosaUtama || ""} /></div>
                  <div className="space-y-2"><Label htmlFor="diagnosaTambahan">Diagnosa Tambahan</Label><Textarea id="diagnosaTambahan" name="diagnosaTambahan" defaultValue={patient.diagnosaTambahan || ""} /></div>
                  <div className="space-y-2"><Label htmlFor="diagnosaKomplikasi">Diagnosa Komplikasi</Label><Textarea id="diagnosaKomplikasi" name="diagnosaKomplikasi" defaultValue={patient.diagnosaKomplikasi || ""} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="penyebabTrauma">Penyebab Trauma</Label><Input id="penyebabTrauma" name="penyebabTrauma" defaultValue={patient.penyebabTrauma || ""} /></div>
                    <div className="space-y-2"><Label htmlFor="hasilPerawatan">Hasil Perawatan</Label><Input id="hasilPerawatan" name="hasilPerawatan" defaultValue={patient.hasilPerawatan || ""} /></div>
                    <div className="space-y-2"><Label htmlFor="caraKeluar">Cara Keluar</Label><Input id="caraKeluar" name="caraKeluar" defaultValue={patient.caraKeluar || ""} /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="operasiTindakan1">Operasi/Tindakan I</Label><Input id="operasiTindakan1" name="operasiTindakan1" defaultValue={patient.operasiTindakan1 || ""} /></div>
                  <div className="space-y-2"><Label htmlFor="operasiTindakan2">Operasi/Tindakan II</Label><Input id="operasiTindakan2" name="operasiTindakan2" defaultValue={patient.operasiTindakan2 || ""} /></div>
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
