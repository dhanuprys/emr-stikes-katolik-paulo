"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  requireInput?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isDestructive = true,
  isLoading = false,
  requireInput,
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  const isConfirmDisabled = isLoading || (requireInput ? inputValue !== requireInput : false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in" 
        onClick={!isLoading ? handleClose : undefined} 
      />
      <div className="relative z-50 w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 fade-in-90 border">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {isDestructive && (
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            )}
            <div className="pt-1 w-full">
              <h2 className="text-lg font-bold text-slate-800">{title}</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{description}</p>
              
              {requireInput && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Ketik <span className="font-bold text-slate-900 select-all">{requireInput}</span> untuk melanjutkan:
                  </label>
                  <Input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={requireInput}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading} className="w-full sm:w-auto bg-white">
            Batal
          </Button>
          <Button 
            variant={isDestructive ? "destructive" : "default"} 
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              "Memproses..."
            ) : (
              <>
                {isDestructive && <Trash2 className="h-4 w-4 mr-2" />}
                Hapus
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
