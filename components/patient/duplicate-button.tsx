"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { duplicatePatientAction } from "@/app/actions/patient";
import { useRouter } from "next/navigation";

export function DuplicatePatientButton({ id, name }: { id: string, name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDuplicate = () => {
    startTransition(async () => {
      const res = await duplicatePatientAction(id);
      if (res?.error) {
        alert(res.error);
      } else if (res?.success && res.newId) {
        setIsOpen(false);
        router.push(`/patient/${res.newId}`);
      } else {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <Button id="tour-btn-duplicate" variant="outline" size="sm" onClick={() => setIsOpen(true)} title="Duplikasi Pasien" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
        <Copy className="h-4 w-4 mr-2" /> Duplicate
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDuplicate}
        title="Duplikasi Pasien"
        description={`Apakah Anda yakin ingin menduplikasi pasien "${name}" beserta seluruh data rekam medisnya (Asesmen, CPPT, Observasi, Lab, Resume)? Ini akan membuat data pasien baru dengan isi yang sama namun dengan nomor RM yang di-generate ulang.`}
        isLoading={isPending}
        isDestructive={false}
        confirmText="Duplikasi"
      />
    </>
  );
}
