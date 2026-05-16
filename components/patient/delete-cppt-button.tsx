"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { deleteCpptAction } from "@/app/actions/cppt";
import { useRouter } from "next/navigation";

export function DeleteCpptButton({ id, date }: { id: string, date: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteCpptAction(id);
      if (res?.error) {
        alert(res.error);
      }
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} title="Hapus CPPT" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Catatan CPPT"
        description={`Apakah Anda yakin ingin menghapus catatan CPPT tanggal ${date}? Tindakan ini tidak dapat dibatalkan.`}
        isLoading={isPending}
        isDestructive={true}
      />
    </>
  );
}
