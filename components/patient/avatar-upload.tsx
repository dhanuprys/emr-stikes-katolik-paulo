"use client";

import { useState, useRef } from "react";
import { User, Camera, Loader2, Trash2 } from "lucide-react";
import { uploadPatientPhotoAction, deletePatientPhotoAction } from "@/app/actions/patient-photo";

interface AvatarUploadProps {
  patientId: string;
  customPhotoUrl?: string | null;
  defaultPhotoUrl: string;
}

export function AvatarUpload({ patientId, customPhotoUrl, defaultPhotoUrl }: AvatarUploadProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(customPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = photoUrl || defaultPhotoUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap unggah file gambar (JPG, PNG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadPatientPhotoAction(patientId, formData);
    
    if (result.success && result.photoUrl) {
      setPhotoUrl(result.photoUrl);
    } else {
      alert(result.message || "Gagal mengunggah foto.");
    }
    
    setIsUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening file dialog
    if (!confirm("Apakah Anda yakin ingin menghapus foto pasien ini?")) return;

    setIsUploading(true);
    const result = await deletePatientPhotoAction(patientId);
    if (result.success) {
      setPhotoUrl(null);
    } else {
      alert(result.message || "Gagal menghapus foto.");
    }
    setIsUploading(false);
  };

  return (
    <div className="relative group shrink-0">
      <div 
        className="h-20 w-20 sm:h-24 sm:w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center overflow-hidden relative cursor-pointer border-2 border-primary/20 shadow-sm transition-all hover:border-primary/50"
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={displayUrl} alt="Patient Avatar" className="h-full w-full object-cover" />
        )}
      </div>

      {/* Permanently visible camera button badge */}
      {!isUploading && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-full shadow-md border-2 border-white hover:bg-primary/90 transition-transform hover:scale-105"
          title="Ubah Foto Pasien"
        >
          <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      )}

      {/* Remove photo button, only visible if there's a custom photo uploaded */}
      {!isUploading && photoUrl && (
        <button
          type="button"
          onClick={handleRemovePhoto}
          className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-1 sm:p-1.5 rounded-full shadow-md border-2 border-white hover:bg-destructive/90 transition-transform hover:scale-105 opacity-0 group-hover:opacity-100"
          title="Hapus Foto"
        >
          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
