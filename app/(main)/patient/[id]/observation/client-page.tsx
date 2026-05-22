"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Clock, Edit, ChevronDown, ChevronRight, Search, User } from "lucide-react";
import { DeleteObservationButton } from "@/components/patient/delete-observation-button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function ObservationClientPage({
  patientId,
  initialObservations
}: {
  patientId: string;
  initialObservations: any[];
}) {
  const [filterDate, setFilterDate] = useState("");
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const toggleExpand = (dateStr: string) => {
    setExpandedDates(prev => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };

  // Group by date
  const grouped: Record<string, typeof initialObservations> = {};
  
  const filtered = filterDate 
    ? initialObservations.filter(o => formatDateStr(o.tanggal) === filterDate)
    : initialObservations;

  filtered.forEach(obs => {
    const dStr = formatDateStr(obs.tanggal);
    if (!grouped[dStr]) grouped[dStr] = [];
    grouped[dStr].push(obs);
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
          <h2 className="text-xl font-semibold">Observasi dan Tindakan</h2>
          <p className="text-sm text-muted-foreground">Catatan tanda-tanda vital, EWS, dan cairan</p>
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
            <Link href={`/patient/${patientId}/observation/new`}>
              <Plus className="h-4 w-4 mr-2" /> Tambah Data
            </Link>
          </Button>
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Tidak ada Data</h3>
          <p className="text-muted-foreground mb-4">Belum ada observasi untuk tanggal ini.</p>
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
                    <Badge variant="outline" className="bg-white/50">{items.length} Data</Badge>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-0 border-t bg-white overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow>
                          <TableHead>Waktu</TableHead>
                          <TableHead>Tensi</TableHead>
                          <TableHead>Nadi</TableHead>
                          <TableHead>RR</TableHead>
                          <TableHead>Balans (ml)</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((obs) => (
                          <TableRow key={obs.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" /> 
                                {new Date(obs.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'})}
                              </div>
                            </TableCell>
                            <TableCell>{obs.tensi}</TableCell>
                            <TableCell>{obs.nadi}</TableCell>
                            <TableCell>{obs.rr}</TableCell>
                            <TableCell>
                              <Badge variant={obs.balans < 0 ? "destructive" : "default"} className={obs.balans >= 0 ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
                                {obs.balans > 0 ? "+" : ""}{obs.balans}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" asChild className="h-8 text-muted-foreground hover:text-primary">
                                  <Link href={`/patient/${patientId}/observation/new?edit=${obs.id}`}>
                                    <Edit className="h-4 w-4 mr-1.5" /> Edit
                                  </Link>
                                </Button>
                                <DeleteObservationButton id={obs.id} date={displayDateStr(dateStr)} />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
