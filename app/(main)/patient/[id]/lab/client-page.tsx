"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, FlaskConical, FileText, Download, ExternalLink, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteLabButton } from "@/components/patient/delete-lab-button";

function isImage(filename: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
}

// Helper to format Date to YYYY-MM-DD for filter comparison
function formatDateStr(date: Date | string) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function LabClientPage({ patientId, initialLabs }: { patientId: string, initialLabs: any[] }) {
  const [filterDate, setFilterDate] = useState("");

  const filteredLabs = filterDate 
    ? initialLabs.filter(lab => formatDateStr(lab.tanggal) === filterDate)
    : initialLabs;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Hasil Laboratorium & Penunjang</h2>
          <p className="text-sm text-muted-foreground">Arsip dokumen hasil tes medis</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="date" 
              className="pl-9" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href={`/patient/${patientId}/lab/new`}>
              <Plus className="h-4 w-4 mr-2" /> Upload Hasil Lab
            </Link>
          </Button>
        </div>
      </div>

      {initialLabs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <FlaskConical className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Tidak ada hasil Lab</h3>
          <p className="text-muted-foreground mb-4">Belum ada dokumen hasil tes yang diunggah.</p>
        </div>
      ) : filteredLabs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Hasil Lab Tidak Ditemukan</h3>
          <p className="text-muted-foreground mb-4">Tidak ada hasil lab untuk tanggal yang dipilih.</p>
          <Button variant="outline" onClick={() => setFilterDate("")}>Tampilkan Semua Data</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredLabs.map((lab) => (
            <Card key={lab.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-primary" />
                    Pemeriksaan Lab
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="text-sm px-3 py-1 bg-white rounded-full border shadow-sm font-medium">
                      {formatDate(lab.tanggal)}
                    </div>
                    <DeleteLabButton id={lab.id} date={formatDate(lab.tanggal)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {lab.files.map((file: string, idx: number) => {
                    const isImg = isImage(file);
                    const name = file.split("/").pop()?.split("-").slice(2).join("-") || `Dokumen ${idx + 1}`;
                    
                    return (
                      <a 
                        key={idx} 
                        href={file} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="group flex flex-col border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all bg-card"
                        title={name}
                      >
                        <div className="h-32 w-full bg-muted/20 relative flex items-center justify-center overflow-hidden border-b">
                          {isImg ? (
                            <img 
                              src={file} 
                              alt={name} 
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
                            />
                          ) : (
                            <FileText className="h-12 w-12 text-muted-foreground/50 transition-colors group-hover:text-primary/50" />
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <ExternalLink className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md h-6 w-6 transition-opacity" />
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-between bg-slate-50/50">
                          <span className="text-xs font-medium truncate flex-1">{name}</span>
                          <Download className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
