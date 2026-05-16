import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, User, FileText, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const searchQuery = q || "";
  const currentPage = parseInt(page || "1", 10);
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const whereClause = searchQuery
    ? {
        OR: [
          { nama: { contains: searchQuery, mode: "insensitive" as any } },
          { noRm: { contains: searchQuery, mode: "insensitive" as any } },
        ],
      }
    : {};

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.patient.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pasien</h1>
          <p className="text-muted-foreground">Kelola data rekam medis pasien</p>
        </div>
        <Button asChild>
          <Link href="/patient/new">
            <Plus className="mr-2 h-4 w-4" /> Tambah Pasien Baru
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <form className="relative flex-1 max-w-md" action="/">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="q"
            placeholder="Cari nama atau No. RM..."
            className="pl-8"
            defaultValue={searchQuery}
          />
        </form>
      </div>

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <Card key={patient.id} className="hover:border-primary/50 transition-colors h-full flex flex-col">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1" title={patient.nama}>
                    {patient.nama}
                  </CardTitle>
                </div>
                <CardDescription className="font-mono text-xs">RM: {patient.noRm}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 flex-1">
                <div className="text-sm space-y-1 mb-3">
                  <p><span className="text-muted-foreground">Gender:</span> {patient.gender === "L" ? "Laki-laki" : "Perempuan"}</p>
                  <p><span className="text-muted-foreground">Umur:</span> {patient.umur}</p>
                  <p><span className="text-muted-foreground">Paviliun:</span> {patient.paviliun} ({patient.kelas})</p>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between items-center bg-muted/30 p-2 rounded-md">
                  <span>Masuk: {formatDate(patient.tanggalMasuk)}</span>
                  {patient.tanggalKeluar ? (
                    <Badge variant="secondary">Keluar</Badge>
                  ) : (
                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Dirawat</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button variant="default" className="flex-1" size="sm" asChild>
                  <Link href={`/patient/${patient.id}`}>
                    <FileText className="h-4 w-4 mr-2" /> Buka
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
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
  );
}
