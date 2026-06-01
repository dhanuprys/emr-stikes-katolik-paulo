import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, User, FileText, Edit, AlertCircle, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

import bgImage from "@/components/assets/rkz.jpg";
import { getDefaultAvatar } from "@/lib/avatar";
import { DashboardTour } from "@/components/dashboard/tour";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; filter?: string }>;
}) {
  const { q, page, filter } = await searchParams;
  const searchQuery = q || "";
  const currentPage = parseInt(page || "1", 10);
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  let whereClause: any = searchQuery
    ? {
      OR: [
        { nama: { contains: searchQuery, mode: "insensitive" as any } },
        { noRm: { contains: searchQuery, mode: "insensitive" as any } },
      ],
    }
    : {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const controlEnd = new Date(today);
  controlEnd.setDate(today.getDate() + 2);
  controlEnd.setHours(23, 59, 59, 999);

  if (filter === "kontrol") {
    whereClause = {
      ...whereClause,
      tanggalKontrolTerdekat: {
        gte: today,
        lte: controlEnd,
      }
    };
  }

  const [patients, total, controlCount, dirawatCount, krsCount] = await Promise.all([
    prisma.patient.findMany({
      where: whereClause,
      orderBy: [
        { tanggalKeluar: "asc" },
        { createdAt: "desc" }
      ],
      skip,
      take: limit,
    }),
    prisma.patient.count({ where: whereClause }),
    prisma.patient.count({
      where: {
        tanggalKontrolTerdekat: {
          gte: today,
          lte: controlEnd,
        }
      }
    }),
    prisma.patient.count({ where: { ...whereClause, tanggalKeluar: null } }),
    prisma.patient.count({ where: { ...whereClause, tanggalKeluar: { not: null } } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/85" />
      </div>
      
      <div className="relative z-10 space-y-6 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SIGAP</h1>
            <p className="text-gray-700 font-bold">Sistem Integrasi Data Pasien</p>
          </div>
          <div className="flex items-center gap-2">
            <DashboardTour hasPatients={patients.length > 0} firstPatientId={patients[0]?.id} />
            <Button id="tour-btn-tambah-pasien" asChild>
              <Link href="/patient/new">
                <Plus className="mr-2 h-4 w-4" /> Tambah Pasien Baru
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <form id="tour-search" className="relative flex-1 max-w-md" action="/">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="search"
              name="q"
              placeholder="Cari nama atau No. RM..."
              className="pl-9 bg-white/90"
              defaultValue={searchQuery}
            />
            {filter && <input type="hidden" name="filter" value={filter} />}
          </form>

          {/* Compact Dashboard Metrics */}
          <div id="tour-stats" className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm bg-white/70 backdrop-blur border border-primary/10 px-4 py-2 rounded-lg w-fit shadow-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary/70" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-slate-800">{total}</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-muted-foreground">Dirawat:</span>
              <span className="font-bold text-emerald-600">{dirawatCount}</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-red-500 rounded-full" />
              <span className="text-muted-foreground">KRS:</span>
              <span className="font-bold text-red-600">{krsCount}</span>
            </div>
          </div>
        </div>

      {controlCount > 0 && filter !== "kontrol" && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-amber-800 font-medium">
              Terdapat {controlCount} pasien yang membutuhkan kontrol dalam 2 hari ke depan.
            </p>
          </div>
          <Button variant="outline" size="sm" className="bg-white text-amber-700 border-amber-200 hover:bg-amber-100" asChild>
            <Link href="/?filter=kontrol">Lihat Pasien</Link>
          </Button>
        </div>
      )}

      {filter === "kontrol" && (
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-800 hover:bg-amber-200">
            Filter: Pasien Butuh Kontrol
          </Badge>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground" asChild>
            <Link href="/"><X className="h-4 w-4 mr-1" /> Hapus Filter</Link>
          </Button>
        </div>
      )}

      {patients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Tidak ada pasien</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Pasien tidak ditemukan dengan kata kunci tersebut." : "Belum ada data pasien yang terdaftar."}
          </p>
          {!searchQuery && (
            <Button asChild variant="outline">
              <Link href="/patient/new">Daftarkan Pasien Pertama</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {patients.map((patient) => (
            <Card key={patient.id} {...(patients.indexOf(patient) === 0 ? { id: "tour-patient-card" } : {})} className="hover:border-primary/50 transition-colors h-full flex flex-col">
              <CardHeader className="p-4 pb-2">
                <div className="flex gap-3 items-center">
                  <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-primary/20 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={patient.photo || getDefaultAvatar(patient.gender, patient.umur)} 
                      alt={patient.nama} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-1" title={patient.nama}>
                        {patient.nama}
                      </CardTitle>
                    </div>
                    <CardDescription className="font-mono text-xs mt-0.5">RM: {patient.noRm}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 flex-1">
                <div className="text-sm space-y-1 mb-3">
                  <p><span className="text-muted-foreground">Gender:</span> {patient.gender === "L" ? "Laki-laki" : "Perempuan"} ({patient.umur} tahun)</p>
                  <p><span className="text-muted-foreground">Paviliun:</span> {patient.paviliun} ({patient.kelas})</p>
                  {patient.dokter1 && <p className="line-clamp-1"><span className="text-muted-foreground">Dokter:</span> {patient.dokter1}</p>}
                  {patient.diagnosaMasuk && <p className="line-clamp-2"><span className="text-muted-foreground">Diagnosa:</span> {patient.diagnosaMasuk}</p>}
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap justify-between items-center gap-2 bg-muted/30 p-2 rounded-md">
                  <span>Masuk: {formatDate(patient.tanggalMasuk)}</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {patient.tanggalKontrolTerdekat && new Date(patient.tanggalKontrolTerdekat) >= today && new Date(patient.tanggalKontrolTerdekat) <= controlEnd && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Jadwal Kontrol</Badge>
                    )}
                    {patient.tanggalKeluar ? (
                      <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">KRS</Badge>
                    ) : (
                      <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Dirawat</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button {...(patients.indexOf(patient) === 0 ? { id: "tour-btn-buka" } : {})} variant="default" className="flex-1" size="sm" asChild>
                  <Link href={`/patient/${patient.id}`}>
                    <FileText className="h-4 w-4 mr-2" /> Buka
                  </Link>
                </Button>
                <Button {...(patients.indexOf(patient) === 0 ? { id: "tour-btn-edit" } : {})} variant="outline" size="sm" asChild>
                  <Link href={`/patient/${patient.id}/edit`} title="Edit Pasien">
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Basic Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={`/?page=${currentPage - 1}${searchQuery ? `&q=${searchQuery}` : ''}`}>Sebelumnya</Link>
            ) : (
              <span>Sebelumnya</span>
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={`/?page=${currentPage + 1}${searchQuery ? `&q=${searchQuery}` : ''}`}>Selanjutnya</Link>
            ) : (
              <span>Selanjutnya</span>
            )}
          </Button>
        </div>
      )}
      </div>
    </div>
  );
}
