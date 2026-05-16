"use client";

import { useState, Fragment } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Activity, FileJson, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuditLogsClient({ initialLogs }: { initialLogs: any[] }) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "UPDATE": return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELETE": return "bg-rose-100 text-rose-800 border-rose-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getEntityName = (entity: string) => {
    switch (entity) {
      case "Patient": return "Pasien";
      case "InitialAssessment": return "Asesmen Awal";
      case "Cppt": return "CPPT";
      case "LabResult": return "Hasil Lab";
      case "AiSummary": return "Ringkasan AI";
      case "User": return "Pengguna";
      default: return entity;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Aksi</th>
                <th className="px-6 py-4">Entitas</th>
                <th className="px-6 py-4">ID Entitas</th>
                <th className="px-6 py-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialLogs.map((log) => (
                <Fragment key={log.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {new Date(log.timestamp).toLocaleString("id-ID", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        {log.userName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-slate-400" />
                        {getEntityName(log.entity)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                      {log.entityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleRow(log.id)}
                        className="text-primary hover:text-primary/80"
                      >
                        <FileJson className="h-4 w-4 mr-2" />
                        {expandedRows[log.id] ? "Tutup" : "Lihat"}
                        {expandedRows[log.id] ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                      </Button>
                    </td>
                  </tr>
                  {/* Expanded Row Details */}
                  {expandedRows[log.id] && (
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="rounded-md bg-slate-900 p-4 overflow-x-auto">
                          <pre className="text-xs text-emerald-400 font-mono">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}

              {initialLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada log aktivitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
