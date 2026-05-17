"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Clock, Edit, ChevronDown, ChevronRight, Search } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { DeleteCpptButton } from "@/components/patient/delete-cppt-button";
import { DatePicker } from "@/components/ui/date-picker";

// Helper to format Date to YYYY-MM-DD
function formatDateStr(date: Date | string) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Format nicely for UI
function displayDateStr(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function CpptClientPage({
  patientId,
  initialCppts
}: {
  patientId: string;
  initialCppts: any[];
}) {
  const [filterDate, setFilterDate] = useState("");
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const toggleExpand = (dateStr: string) => {
    setExpandedDates(prev => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };

  // Group by date
  const grouped: Record<string, typeof initialCppts> = {};
  
  const filtered = filterDate 
    ? initialCppts.filter(c => formatDateStr(c.tanggal) === filterDate)
    : initialCppts;

  filtered.forEach(cppt => {
    const dStr = formatDateStr(cppt.tanggal);
    if (!grouped[dStr]) grouped[dStr] = [];
    grouped[dStr].push(cppt);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

  // Auto-expand the most recent date if no filter is applied and state is empty
  if (sortedDates.length > 0 && Object.keys(expandedDates).length === 0) {
    setExpandedDates({ [sortedDates[0]]: true });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Catatan Perkembangan Pasien Terintegrasi (CPPT)</h2>
          <p className="text-sm text-muted-foreground">Riwayat perkembangan harian pasien</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <DatePicker 
              className="pl-9 bg-white w-full" 
              value={filterDate}
              onChange={(val) => setFilterDate(val)}
            />
          </div>
          <Button asChild>
            <Link href={`/patient/${patientId}/cppt/new`}>
              <Plus className="h-4 w-4 mr-2" /> Tambah CPPT
            </Link>
          </Button>
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Tidak ada CPPT</h3>
          <p className="text-muted-foreground mb-4">Belum ada catatan untuk tanggal ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((dateStr) => {
            const isExpanded = expandedDates[dateStr];
            const items = grouped[dateStr];

            return (
              <div key={dateStr} className="border rounded-xl bg-card overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleExpand(dateStr)}
                  className="w-full px-4 py-3 bg-muted/30 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                    <span className="font-semibold">{displayDateStr(dateStr)}</span>
                    <Badge variant="outline" className="bg-white/50">{items.length} Catatan</Badge>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-4 space-y-4 border-t bg-slate-50/50">
                    {items.map((cppt) => (
                      <Card key={cppt.id} className="overflow-hidden bg-white shadow-sm">
                        <div className="border-b bg-muted/10 px-4 py-2.5 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Badge variant={cppt.waktu === "Pagi" ? "default" : cppt.waktu === "Siang" ? "secondary" : "outline"} className={cppt.waktu === "Malam" ? "bg-slate-800 text-white hover:bg-slate-700" : ""}>
                              Shift {cppt.waktu}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {new Date(cppt.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'})}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" asChild className="h-8 text-muted-foreground hover:text-primary">
                              <Link href={`/patient/${patientId}/cppt/new?edit=${cppt.id}`}>
                                <Edit className="h-4 w-4 mr-1.5" /> Edit
                              </Link>
                            </Button>
                            <DeleteCpptButton id={cppt.id} date={displayDateStr(dateStr)} />
                          </div>
                        </div>
                        <CardContent className="p-0">
                          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x">
                            <div className="p-4 space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-primary mb-1">S - Subjektif</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{cppt.subjektif}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-primary mb-1">O - Objektif</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{cppt.objektif}</p>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-primary mb-1">A - Assessment</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{cppt.assessment}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-primary mb-1">P - Planning</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{cppt.planning}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
