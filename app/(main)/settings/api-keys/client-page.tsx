"use client";

import { useActionState, useState, useTransition } from "react";
import { addApiKeyAction, toggleApiKeyAction, deleteApiKeyAction } from "@/app/actions/api-keys";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Key, Plus, Trash2, ToggleLeft, ToggleRight, Eye, EyeOff, ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ApiKeysClient({ initialKeys }: { initialKeys: any[] }) {
  const [state, addAction, addPending] = useActionState(addApiKeyAction, undefined);
  const [isPending, startTransition] = useTransition();
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const toggleReveal = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggle = (id: string) => {
    startTransition(async () => {
      await toggleApiKeyAction(id);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus API Key ini?")) return;
    startTransition(async () => {
      await deleteApiKeyAction(id);
      router.refresh();
    });
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••••••" + key.slice(-4);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan API Keys</h1>
          <p className="text-sm text-muted-foreground">Kelola kunci API untuk fitur Ringkasan AI (Gemini)</p>
        </div>
      </div>

      {/* Add new key form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" /> Tambah API Key Baru
          </CardTitle>
          <CardDescription>Tambahkan beberapa key untuk menghindari kehabisan kuota</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addAction} className="flex flex-col sm:flex-row gap-3">
            <input type="hidden" name="provider" value="gemini" />
            <div className="flex-1 space-y-1">
              <Label htmlFor="name" className="sr-only">Nama</Label>
              <Input id="name" name="name" placeholder="Nama (contoh: Gemini Key 1)" required />
            </div>
            <div className="flex-[2] space-y-1">
              <Label htmlFor="key" className="sr-only">API Key</Label>
              <Input id="key" name="key" placeholder="AIzaSy... (paste API key)" required type="password" />
            </div>
            <Button type="submit" disabled={addPending} className="shrink-0">
              {addPending ? "Menyimpan..." : "Tambah"}
            </Button>
          </form>
          {state?.message && (
            <p className="text-sm text-destructive mt-2">{state.message}</p>
          )}
          {state?.success && (
            <p className="text-sm text-emerald-600 mt-2">API Key berhasil ditambahkan!</p>
          )}
        </CardContent>
      </Card>

      {/* Key list */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Daftar API Keys ({initialKeys.length})</h3>

        {initialKeys.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Key className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Belum ada API Key</h3>
              <p className="text-muted-foreground text-sm">Tambahkan minimal satu Gemini API Key untuk mengaktifkan fitur Ringkasan AI.</p>
            </CardContent>
          </Card>
        ) : (
          initialKeys.map((apiKey) => (
            <Card key={apiKey.id} className={`transition-opacity ${!apiKey.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${apiKey.isActive ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    <Key className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{apiKey.name}</span>
                      <Badge variant={apiKey.isActive ? "default" : "secondary"} className={apiKey.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                        {apiKey.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{apiKey.provider}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="text-xs text-muted-foreground font-mono">
                        {revealedKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <button onClick={() => toggleReveal(apiKey.id)} className="text-muted-foreground hover:text-foreground" title="Tampilkan/Sembunyikan">
                        {revealedKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2" title="Penggunaan">
                    <BarChart3 className="h-3 w-3" />
                    <span>{apiKey.usageCount}x</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggle(apiKey.id)}
                    disabled={isPending}
                    title={apiKey.isActive ? "Nonaktifkan" : "Aktifkan"}
                  >
                    {apiKey.isActive ? <ToggleRight className="h-5 w-5 text-emerald-600" /> : <ToggleLeft className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(apiKey.id)}
                    disabled={isPending}
                    className="text-destructive hover:bg-destructive/10"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
