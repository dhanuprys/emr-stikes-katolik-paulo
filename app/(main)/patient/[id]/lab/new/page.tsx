"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { createLabResultAction } from "@/app/actions/lab-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FileUp, Info, FileText, Image as ImageIcon, X } from "lucide-react";

export default function NewLabResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [patientId, setPatientId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    params.then((p) => setPatientId(p.id));
  }, [params]);

  // Bind patientId to action
  const actionWithId = createLabResultAction.bind(null, patientId);
  const [state, action, pending] = useActionState(actionWithId, undefined);

  // Handle file selection and preview generation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFilesArray = Array.from(e.target.files);
      
      setSelectedFiles(prev => {
        // Prevent exact duplicates
        const existingKeys = new Set(prev.map(f => `${f.name}-${f.size}`));
        const uniqueNewFiles = newFilesArray.filter(f => !existingKeys.has(`${f.name}-${f.size}`));
        return [...prev, ...uniqueNewFiles];
      });
    }
  };

  // Sync state with native input and generate previews whenever selectedFiles changes
  useEffect(() => {
    // 1. Sync with native input so the form submission catches all files
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      selectedFiles.forEach(file => dt.items.add(file));
      fileInputRef.current.files = dt.files;
    }

    // 2. Generate previews
    // Cleanup old previews to prevent memory leaks
    previewUrls.forEach(url => { if(url) URL.revokeObjectURL(url); });
    
    // Create new previews
    const urls = selectedFiles.map(file => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return "";
    });
    setPreviewUrls(urls);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => { if (url) URL.revokeObjectURL(url); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };
  
  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  if (!patientId) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Upload Hasil Lab</h2>
          <p className="text-sm text-muted-foreground">Unggah file dokumen hasil pemeriksaan medis</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/patient/${patientId}/lab`}>Batal</Link>
        </Button>
      </div>

      <form action={action}>
        <Card>
          <CardHeader>
            <CardTitle>Data Laboratorium</CardTitle>
            <CardDescription>Format yang didukung: PDF, JPG, PNG, JPEG</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal Keluar Hasil <span className="text-destructive">*</span></Label>
              <Input id="tanggal" name="tanggal" type="date" required />
            </div>

            <div className="space-y-2">
              <Label>Dokumen Hasil Lab <span className="text-destructive">*</span></Label>
              <label 
                htmlFor="files"
                className="block relative border-2 border-dashed border-input rounded-md p-8 text-center hover:bg-muted/50 transition-colors bg-muted/20 cursor-pointer"
              >
                <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                
                <input 
                  id="files" 
                  name="files" 
                  type="file" 
                  multiple 
                  required={selectedFiles.length === 0} 
                  onChange={handleFileChange}
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  className="sr-only"
                  ref={fileInputRef}
                />
                
                <h3 className="font-semibold text-lg">Klik atau Drag & Drop file ke sini</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Anda dapat mengunggah banyak file sekaligus.
                </p>
                <Button type="button" variant="secondary" className="mt-4 pointer-events-none">
                  Pilih File
                </Button>
              </label>
            </div>

            {/* File Previews */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>File yang dipilih ({selectedFiles.length})</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={clearAllFiles} className="text-destructive h-auto p-1">
                    Hapus Semua
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative border rounded-lg p-2 bg-background shadow-sm group overflow-hidden flex flex-col items-center text-center">
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 z-10 bg-destructive/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive"
                        title="Hapus file ini"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="h-24 w-full flex items-center justify-center bg-muted/30 rounded-md mb-2 overflow-hidden border">
                        {previewUrls[idx] ? (
                          <img src={previewUrls[idx]} alt={file.name} className="object-cover w-full h-full" />
                        ) : (
                          <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs font-medium truncate w-full px-1" title={file.name}>{file.name}</p>
                      <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 text-blue-800 p-4 rounded-md flex gap-3 text-sm">
              <Info className="h-5 w-5 shrink-0" />
              <p>File yang diunggah akan otomatis disimpan ke dalam arsip rekam medis pasien dan tidak dapat dihapus melalui antarmuka ini demi menjaga integritas data (Audit Trail).</p>
            </div>
          </CardContent>
        </Card>

        {state?.message && (
          <div className="mt-6 bg-destructive/15 text-destructive p-4 rounded-md text-sm">
            {state.message}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg" disabled={pending || selectedFiles.length === 0}>
            {pending ? "Mengunggah Dokumen..." : `Unggah ${selectedFiles.length > 0 ? selectedFiles.length : ''} Dokumen`}
          </Button>
        </div>
      </form>
    </div>
  );
}
