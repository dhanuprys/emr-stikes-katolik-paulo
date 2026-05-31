"use client";

import { useState, useRef } from "react";
import { User, Camera, Loader2 } from "lucide-react";
import { uploadPatientPhotoAction } from "@/app/actions/patient-photo";

interface AvatarUploadProps {
  patientId: string;
  initialPhotoUrl?: string | null;
}

export function AvatarUpload({ patientId, initialPhotoUrl }: AvatarUploadProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: client-side validation (size, type)
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
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative group shrink-0">
      <div 
        className="h-20 w-20 sm:h-24 sm:w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center overflow-hidden relative cursor-pointer border-2 border-primary/20 shadow-sm transition-all hover:border-primary/50"
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : photoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={photoUrl} alt="Patient Avatar" className="h-full w-full object-cover" />
        ) : (
          <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary/60" />
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
