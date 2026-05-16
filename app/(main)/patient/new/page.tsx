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
            <CardHeader>
              <CardTitle>Identitas Rekam Medis</CardTitle>
              <CardDescription>Informasi registrasi rumah sakit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noRegMrs">No Reg MRS <span className="text-destructive">*</span></Label>
                  <Input id="noRegMrs" name="noRegMrs" required />
                  {state?.errors?.noRegMrs && <p className="text-sm text-destructive">{state.errors.noRegMrs[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noRm">No. RM <span className="text-destructive">*</span></Label>
                  <Input id="noRm" name="noRm" required />
                  {state?.errors?.noRm && <p className="text-sm text-destructive">{state.errors.noRm[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paviliun">Paviliun <span className="text-destructive">*</span></Label>
                  <Input id="paviliun" name="paviliun" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelas">Kelas <span className="text-destructive">*</span></Label>
                  <Input id="kelas" name="kelas" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tanggalMasuk">Tanggal Masuk <span className="text-destructive">*</span></Label>
                <Input id="tanggalMasuk" name="tanggalMasuk" type="datetime-local" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggalKeluar">Tanggal Keluar (Opsional)</Label>
                  <Input id="tanggalKeluar" name="tanggalKeluar" type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalMeninggal">Tanggal Meninggal (Opsional)</Label>
                  <Input id="tanggalMeninggal" name="tanggalMeninggal" type="datetime-local" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asalPasien">Asal Pasien <span className="text-destructive">*</span></Label>
                  <Input id="asalPasien" name="asalPasien" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biaya">Biaya <span className="text-destructive">*</span></Label>
                  <Input id="biaya" name="biaya" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Asal MRS <span className="text-destructive">*</span></Label>
                <div className="flex gap-4 items-center h-10">
                  <label className="flex items-center gap-2"><input type="radio" name="asalMrs" value="Poli" required /> Poli</label>
                  <label className="flex items-center gap-2"><input type="radio" name="asalMrs" value="IGD" /> IGD</label>
                  <label className="flex items-center gap-2"><input type="radio" name="asalMrs" value="Praktek" /> Praktek</label>
                  <label className="flex items-center gap-2"><input type="radio" name="asalMrs" value="Admission" /> Admission</label>
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
                <Input id="nama" name="nama" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat <span className="text-destructive">*</span></Label>
                <Textarea id="alamat" name="alamat" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kota">Kota <span className="text-destructive">*</span></Label>
                  <Input id="kota" name="kota" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provinsi">Provinsi <span className="text-destructive">*</span></Label>
                  <Input id="provinsi" name="provinsi" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noTelp">No. Telp <span className="text-destructive">*</span></Label>
                  <Input id="noTelp" name="noTelp" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalLahir">Tanggal Lahir <span className="text-destructive">*</span></Label>
                  <Input id="tanggalLahir" name="tanggalLahir" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label>Gender <span className="text-destructive">*</span></Label>
                  <div className="flex gap-4 items-center h-10">
                    <label className="flex items-center gap-2"><input type="radio" name="gender" value="L" required /> Laki-laki</label>
                    <label className="flex items-center gap-2"><input type="radio" name="gender" value="P" /> Perempuan</label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="umur">Umur <span className="text-destructive">*</span></Label>
                  <Input id="umur" name="umur" required suffix="thn" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="bangsa">Bangsa <span className="text-destructive">*</span></Label><Input id="bangsa" name="bangsa" required /></div>
                <div className="space-y-2"><Label htmlFor="agama">Agama <span className="text-destructive">*</span></Label><Input id="agama" name="agama" required /></div>
                <div className="space-y-2"><Label htmlFor="pendidikan">Pendidikan <span className="text-destructive">*</span></Label><Input id="pendidikan" name="pendidikan" required /></div>
                <div className="space-y-2"><Label htmlFor="pekerjaan">Pekerjaan <span className="text-destructive">*</span></Label><Input id="pekerjaan" name="pekerjaan" required /></div>
                <div className="space-y-2"><Label htmlFor="statusPernikahan">Status Pernikahan</Label><Input id="statusPernikahan" name="statusPernikahan" /></div>
                <div className="space-y-2"><Label htmlFor="namaSuamiIstri">Nama Suami/Istri</Label><Input id="namaSuamiIstri" name="namaSuamiIstri" /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Keluarga & Dokter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="namaAyah">Nama Ayah <span className="text-destructive">*</span></Label><Input id="namaAyah" name="namaAyah" required /></div>
                <div className="space-y-2"><Label htmlFor="namaIbu">Nama Ibu <span className="text-destructive">*</span></Label><Input id="namaIbu" name="namaIbu" required /></div>
                <div className="space-y-2"><Label htmlFor="noRmIbu">No RM Ibu <span className="text-destructive">*</span></Label><Input id="noRmIbu" name="noRmIbu" required /></div>
                <div className="space-y-2"><Label htmlFor="pekerjaanIbu">Pekerjaan Ibu <span className="text-destructive">*</span></Label><Input id="pekerjaanIbu" name="pekerjaanIbu" required /></div>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-4">Kontak Darurat</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="daruratNama">Nama <span className="text-destructive">*</span></Label><Input id="daruratNama" name="daruratNama" required /></div>
                  <div className="space-y-2"><Label htmlFor="daruratHubungan">Hubungan <span className="text-destructive">*</span></Label><Input id="daruratHubungan" name="daruratHubungan" required /></div>
                  <div className="space-y-2"><Label htmlFor="daruratTelepon">Telepon <span className="text-destructive">*</span></Label><Input id="daruratTelepon" name="daruratTelepon" required /></div>
                  <div className="space-y-2"><Label htmlFor="daruratAlamat">Alamat <span className="text-destructive">*</span></Label><Textarea id="daruratAlamat" name="daruratAlamat" required /></div>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-4">Dokter Penanggung Jawab</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="dokter1">Dokter I <span className="text-destructive">*</span></Label><Input id="dokter1" name="dokter1" required /></div>
                  <div className="space-y-2"><Label htmlFor="dokter2">Dokter II (Opsional)</Label><Input id="dokter2" name="dokter2" /></div>
                  <div className="space-y-2"><Label htmlFor="dokter3">Dokter III (Opsional)</Label><Input id="dokter3" name="dokter3" /></div>
                  <div className="space-y-2"><Label htmlFor="dokter4">Dokter IV (Opsional)</Label><Input id="dokter4" name="dokter4" /></div>
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
                  <label className="flex items-center gap-2"><input type="radio" name="jenisKasus" value="bedah" required /> Bedah</label>
                  <label className="flex items-center gap-2"><input type="radio" name="jenisKasus" value="penyakit dalam" /> Penyakit Dalam</label>
                </div>
              </div>
              <div className="space-y-2"><Label htmlFor="diagnosaMasuk">Diagnosa Masuk <span className="text-destructive">*</span></Label><Textarea id="diagnosaMasuk" name="diagnosaMasuk" required /></div>
              
              <div className="border-t pt-4 mt-4 opacity-75">
                <h4 className="font-medium mb-4 text-muted-foreground">Bagian Keluar (Diisi saat KRS)</h4>
                <div className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="diagnosaKeluar">Diagnosa Keluar</Label><Textarea id="diagnosaKeluar" name="diagnosaKeluar" /></div>
                  <div className="space-y-2"><Label htmlFor="diagnosaUtama">Diagnosa Utama</Label><Textarea id="diagnosaUtama" name="diagnosaUtama" /></div>
                  <div className="space-y-2"><Label htmlFor="diagnosaTambahan">Diagnosa Tambahan</Label><Textarea id="diagnosaTambahan" name="diagnosaTambahan" /></div>
                  <div className="space-y-2"><Label htmlFor="diagnosaKomplikasi">Diagnosa Komplikasi</Label><Textarea id="diagnosaKomplikasi" name="diagnosaKomplikasi" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="penyebabTrauma">Penyebab Trauma</Label><Input id="penyebabTrauma" name="penyebabTrauma" /></div>
                    <div className="space-y-2"><Label htmlFor="hasilPerawatan">Hasil Perawatan</Label><Input id="hasilPerawatan" name="hasilPerawatan" /></div>
                    <div className="space-y-2"><Label htmlFor="caraKeluar">Cara Keluar</Label><Input id="caraKeluar" name="caraKeluar" /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="operasiTindakan1">Operasi/Tindakan I</Label><Input id="operasiTindakan1" name="operasiTindakan1" /></div>
                  <div className="space-y-2"><Label htmlFor="operasiTindakan2">Operasi/Tindakan II</Label><Input id="operasiTindakan2" name="operasiTindakan2" /></div>
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
