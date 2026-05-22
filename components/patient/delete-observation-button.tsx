"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteObservationAction } from "@/app/actions/observation";

export function DeleteObservationButton({ id, date }: { id: string; date: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus data observasi untuk tanggal ${date}?`)) {
      startTransition(async () => {
        const res = await deleteObservationAction(id);
        if (!res.success) {
          alert(res.message);
        }
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete} 
      disabled={isPending}
      className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      {isPending ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1.5" />}
      Hapus
    </Button>
  );
}
