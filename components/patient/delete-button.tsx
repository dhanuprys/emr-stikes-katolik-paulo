"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { deletePatientAction } from "@/app/actions/patient";
import { useRouter } from "next/navigation";

export function DeletePatientButton({ id, name }: { id: string, name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deletePatientAction(id);
      if (res?.error) {
        alert(res.error);
      }
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} title="Hapus Pasien" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Pasien"
        description={`Apakah Anda yakin ingin menghapus pasien "${name}"? Semua rekam medis (Asesmen, Timbang Terima, Observasi dan Tindakan, Hasil Lab) terkait pasien ini akan terhapus secara permanen.`}
        isLoading={isPending}
        isDestructive={true}
        requireInput="KONFIRMASI"
      />
    </>
  );
}
