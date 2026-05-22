"use client";

import { useActionState } from "react";
import { createPatientAction } from "@/app/actions/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export default function NewPatientPage() {
  const [state, action, pending] = useActionState(createPatientAction, undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pasien Baru</h1>
          <p className="text-muted-foreground">Pendaftaran Ringkasan Masuk-Keluar Pasien Rawat Inap</p>
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
                  <Label className="text-slate-600 font-semibold" htmlFor="noRegMrs">No Reg MRS <span className="text-destructive">*</span></Label>
                  <Input id="noRegMrs" name="noRegMrs" required  className="bg-white" />
                  {state?.errors?.noRegMrs && <p className="text-sm text-destructive">{state.errors.noRegMrs[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="noRm">No. RM <span className="text-destructive">*</span></Label>
                  <Input id="noRm" name="noRm" required  className="bg-white" />
                  {state?.errors?.noRm && <p className="text-sm text-destructive">{state.errors.noRm[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="paviliun">Paviliun <span className="text-destructive">*</span></Label>
                  <Input id="paviliun" name="paviliun" required  className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="kelas">Kelas <span className="text-destructive">*</span></Label>
                  <Input id="kelas" name="kelas" required  className="bg-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold" htmlFor="tanggalMasuk">Tanggal Masuk <span className="text-destructive">*</span></Label>
                <DatePicker id="tanggalMasuk" name="tanggalMasuk" withTime  required  className="bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="tanggalKeluar">Tanggal Keluar (Opsional)</Label>
                  <DatePicker id="tanggalKeluar" name="tanggalKeluar" withTime   className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="tanggalMeninggal">Tanggal Meninggal (Opsional)</Label>
                  <DatePicker id="tanggalMeninggal" name="tanggalMeninggal" withTime   className="bg-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="asalPasien">Asal Pasien <span className="text-destructive">*</span></Label>
                  <Input id="asalPasien" name="asalPasien" required  className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="biaya">Biaya <span className="text-destructive">*</span></Label>
                  <Input id="biaya" name="biaya" required  className="bg-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Asal MRS <span className="text-destructive">*</span></Label>
                <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white/60">
                  <label className="clinical-control-label"><input type="radio" name="asalMrs" value="Poli" required  className="clinical-radio" /> Poli</label>
                  <label className="clinical-control-label"><input type="radio" name="asalMrs" value="IGD"  className="clinical-radio" /> IGD</label>
                  <label className="clinical-control-label"><input type="radio" name="asalMrs" value="Praktek"  className="clinical-radio" /> Praktek</label>
                  <label className="clinical-control-label"><input type="radio" name="asalMrs" value="Admission"  className="clinical-radio" /> Admission</label>
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
                <Label className="text-slate-600 font-semibold" htmlFor="nama">Nama Lengkap <span className="text-destructive">*</span></Label>
                <Input id="nama" name="nama" required  className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold" htmlFor="alamat">Alamat <span className="text-destructive">*</span></Label>
                <Textarea id="alamat" name="alamat" required  className="bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="kota">Kota <span className="text-destructive">*</span></Label>
                  <Input id="kota" name="kota" required  className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="provinsi">Provinsi <span className="text-destructive">*</span></Label>
                  <Input id="provinsi" name="provinsi" required  className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="noTelp">No. Telp <span className="text-destructive">*</span></Label>
                  <Input id="noTelp" name="noTelp" required  className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="tanggalLahir">Tanggal Lahir <span className="text-destructive">*</span></Label>
                  <DatePicker id="tanggalLahir" name="tanggalLahir"  required  className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold">Gender <span className="text-destructive">*</span></Label>
                  <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white/60">
                    <label className="clinical-control-label"><input type="radio" name="gender" value="L" required  className="clinical-radio" /> Laki-laki</label>
                    <label className="clinical-control-label"><input type="radio" name="gender" value="P"  className="clinical-radio" /> Perempuan</label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold" htmlFor="umur">Umur <span className="text-destructive">*</span></Label>
                  <Input id="umur" name="umur" required suffix="thn"  className="bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="bangsa">Bangsa <span className="text-destructive">*</span></Label><Input id="bangsa" name="bangsa" required  className="bg-white" /></div>
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="agama">Agama <span className="text-destructive">*</span></Label><Input id="agama" name="agama" required  className="bg-white" /></div>
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="pendidikan">Pendidikan <span className="text-destructive">*</span></Label><Input id="pendidikan" name="pendidikan" required  className="bg-white" /></div>
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="pekerjaan">Pekerjaan <span className="text-destructive">*</span></Label><Input id="pekerjaan" name="pekerjaan" required  className="bg-white" /></div>
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="statusPernikahan">Status Pernikahan</Label><Input id="statusPernikahan" name="statusPernikahan"  className="bg-white" /></div>
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="namaSuamiIstri">Nama Suami/Istri</Label><Input id="namaSuamiIstri" name="namaSuamiIstri"  className="bg-white" /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800">Data Keluarga & Dokter</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="namaAyah">Nama Ayah</Label><Input id="namaAyah" name="namaAyah"  className="bg-white" /></div>
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="namaIbu">Nama Ibu</Label><Input id="namaIbu" name="namaIbu"  className="bg-white" /></div>
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="noRmIbu">No RM Ibu</Label><Input id="noRmIbu" name="noRmIbu"  className="bg-white" /></div>
                <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="pekerjaanIbu">Pekerjaan Ibu</Label><Input id="pekerjaanIbu" name="pekerjaanIbu"  className="bg-white" /></div>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-4">Kontak Darurat</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="daruratNama">Nama <span className="text-destructive">*</span></Label><Input id="daruratNama" name="daruratNama" required  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="daruratHubungan">Hubungan <span className="text-destructive">*</span></Label><Input id="daruratHubungan" name="daruratHubungan" required  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="daruratTelepon">Telepon <span className="text-destructive">*</span></Label><Input id="daruratTelepon" name="daruratTelepon" required  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="daruratAlamat">Alamat <span className="text-destructive">*</span></Label><Textarea id="daruratAlamat" name="daruratAlamat" required  className="bg-white" /></div>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-4">Dokter Penanggung Jawab</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="dokter1">Dokter I <span className="text-destructive">*</span></Label><Input id="dokter1" name="dokter1" required  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="dokter2">Dokter II (Opsional)</Label><Input id="dokter2" name="dokter2"  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="dokter3">Dokter III (Opsional)</Label><Input id="dokter3" name="dokter3"  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="dokter4">Dokter IV (Opsional)</Label><Input id="dokter4" name="dokter4"  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="dokter5">Dokter V (Opsional)</Label><Input id="dokter5" name="dokter5"  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="dokter6">Dokter VI (Opsional)</Label><Input id="dokter6" name="dokter6"  className="bg-white" /></div>
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
                <Label className="text-slate-600 font-semibold">Jenis Kasus <span className="text-destructive">*</span></Label>
                <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white/60">
                  <label className="clinical-control-label"><input type="radio" name="jenisKasus" value="bedah" required  className="clinical-radio" /> Bedah</label>
                  <label className="clinical-control-label"><input type="radio" name="jenisKasus" value="penyakit dalam"  className="clinical-radio" /> Penyakit Dalam</label>
                </div>
              </div>
              <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="diagnosaMasuk">Diagnosa Masuk <span className="text-destructive">*</span></Label><Textarea id="diagnosaMasuk" name="diagnosaMasuk" required  className="bg-white" /></div>
              
              <div className="border-t pt-4 mt-4 opacity-75">
                <h4 className="font-medium mb-4 text-muted-foreground">Bagian Keluar (Diisi saat KRS)</h4>
                <div className="space-y-4">
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="diagnosaKeluar">Diagnosa Keluar</Label><Textarea id="diagnosaKeluar" name="diagnosaKeluar"  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="diagnosaUtama">Diagnosa Utama</Label><Textarea id="diagnosaUtama" name="diagnosaUtama"  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="diagnosaTambahan">Diagnosa Tambahan</Label><Textarea id="diagnosaTambahan" name="diagnosaTambahan"  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="diagnosaKomplikasi">Diagnosa Komplikasi</Label><Textarea id="diagnosaKomplikasi" name="diagnosaKomplikasi"  className="bg-white" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="penyebabTrauma">Penyebab Trauma</Label><Input id="penyebabTrauma" name="penyebabTrauma"  className="bg-white" /></div>
                    <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="hasilPerawatan">Hasil Perawatan</Label><Input id="hasilPerawatan" name="hasilPerawatan"  className="bg-white" /></div>
                    <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="caraKeluar">Cara Keluar</Label><Input id="caraKeluar" name="caraKeluar"  className="bg-white" /></div>
                  </div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="operasiTindakan1">Operasi/Tindakan I</Label><Input id="operasiTindakan1" name="operasiTindakan1"  className="bg-white" /></div>
                  <div className="space-y-2"><Label className="text-slate-600 font-semibold" htmlFor="operasiTindakan2">Operasi/Tindakan II</Label><Input id="operasiTindakan2" name="operasiTindakan2"  className="bg-white" /></div>
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
            <Link href="/">Batal</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Menyimpan..." : "Simpan Pasien Baru"}
          </Button>
        </div>
      </form>
    </div>
  );
}
