"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { deleteLabResultAction } from "@/app/actions/lab-result";
import { useRouter } from "next/navigation";

export function DeleteLabButton({ id, date }: { id: string, date: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteLabResultAction(id);
      if (res?.error) {
        alert(res.error);
      }
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} title="Hapus Hasil Lab" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Hasil Lab"
        description={`Apakah Anda yakin ingin menghapus dokumen hasil lab tanggal ${date}? Ini akan menghapus data dan file fisiknya secara permanen.`}
        isLoading={isPending}
        isDestructive={true}
      />
    </>
  );
}
