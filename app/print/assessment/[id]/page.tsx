import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { assessmentSections } from "@/lib/assessment-fields";
import { formatDate } from "@/lib/utils";
import { PrintButton } from "./print-button";

export const metadata = {
  title: "Cetak Asesmen Awal",
};

export default async function AssessmentPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [patient, assessment] = await Promise.all([
    prisma.patient.findUnique({ where: { id } }),
    prisma.initialAssessment.findUnique({ where: { patientId: id } }),
  ]);

  if (!patient) return notFound();

  const data: Record<string, any> = (assessment?.data as any) || {};

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: A4;
          margin: 12mm 15mm;
        }
        @media print {
          .no-print { display: none !important; }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
            background: white !important;
            min-height: auto !important;
            overflow: visible !important;
          }
          /* Allow the flex column layout from root to not constrain height */
          body, html { height: auto !important; }
        }

        .print-page {
          max-width: 210mm;
          margin: 0 auto;
          font-size: 10px;
          line-height: 1.45;
          color: #1a1a1a;
        }
        @media screen {
          .print-page { padding: 20px; }
        }

        /* Print button bar */
        .print-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
          background: #1e293b; color: white;
          padding: 12px 24px;
          display: flex; justify-content: space-between; align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,.15);
        }
        .print-bar h3 { font-size: 14px; font-weight: 600; }
        .print-bar-spacer { height: 56px; }

        /* Header */
        .print-header {
          text-align: center;
          border-bottom: 2px solid #1e293b;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .print-header h1 { font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
        .print-header h2 { font-size: 12px; font-weight: 600; margin-top: 2px; color: #334155; }

        /* Patient info bar */
        .print-patient-info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 4px 16px;
          background: #f1f5f9;
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 14px;
          border: 1px solid #e2e8f0;
          font-size: 10px;
        }
        .pi-label { color: #64748b; }
        .pi-value { font-weight: 600; }

        /* Section — allow page breaks INSIDE long sections so nothing gets cropped.
           The title+body pair should stay together when possible via orphans/widows. */
        .print-section {
          margin-bottom: 10px;
          break-inside: auto;
          page-break-inside: auto;
        }
        .print-section-title {
          background: #1e293b;
          color: white;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 3px 3px 0 0;
          margin: 0;
          /* Keep the title attached to at least the first few lines of its body */
          break-after: avoid;
          page-break-after: avoid;
        }
        .print-section-body {
          border: 1px solid #cbd5e1;
          border-top: none;
          border-radius: 0 0 3px 3px;
          padding: 6px 10px;
        }

        /* Field grid */
        .print-field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px 16px;
        }
        .print-field {
          display: flex;
          gap: 6px;
          padding: 2px 0;
          border-bottom: 1px dotted #e2e8f0;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .print-field:last-child { border-bottom: none; }
        .print-field-wide { grid-column: 1 / -1; }
        .print-f-label {
          min-width: 140px;
          color: #64748b;
          flex-shrink: 0;
        }
        .print-f-value {
          font-weight: 500;
          word-break: break-word;
        }
        .print-f-empty { color: #94a3b8; font-style: italic; font-weight: 400; }

        /* Tables */
        .print-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 4px;
          font-size: 10px;
        }
        .print-table th, .print-table td {
          border: 1px solid #cbd5e1;
          padding: 4px 8px;
          text-align: left;
        }
        .print-table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #334155;
        }
        .print-table tr {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* Footer / Signature — NEVER split across pages */
        .print-footer {
          margin-top: 24px;
          padding-top: 8px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          break-inside: avoid;
          page-break-inside: avoid;
          break-before: auto;
          page-break-before: auto;
        }
        .print-sig-box {
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 8px 16px;
          min-width: 160px;
          text-align: center;
          flex: 1;
        }
        .print-sig-title { font-size: 10px; color: #64748b; margin-bottom: 50px; }
        .print-sig-line { border-top: 1px solid #1a1a1a; padding-top: 4px; font-weight: 600; }
      `}} />

      {/* Print toolbar — hidden on print */}
      <div className="print-bar no-print">
        <h3>Preview Cetak Asesmen Awal — {patient.nama}</h3>
        <PrintButton />
      </div>
      <div className="print-bar-spacer no-print" />

      <div className="print-page">
        {/* Document Header */}
        <div className="print-header">
          <h1>RS Santo Vincentius A Paulo</h1>
          <h2>Asesmen Awal Medis & Keperawatan</h2>
        </div>

        {/* Patient Info */}
        <div className="print-patient-info">
          <div><span className="pi-label">Nama: </span><span className="pi-value">{patient.nama}</span></div>
          <div><span className="pi-label">No. RM: </span><span className="pi-value">{patient.noRm}</span></div>
          <div><span className="pi-label">No. Reg MRS: </span><span className="pi-value">{patient.noRegMrs}</span></div>
          <div><span className="pi-label">Tgl Lahir: </span><span className="pi-value">{formatDate(patient.tanggalLahir)}</span></div>
          <div><span className="pi-label">Gender: </span><span className="pi-value">{patient.gender === "L" ? "Laki-laki" : "Perempuan"}</span></div>
          <div><span className="pi-label">Umur: </span><span className="pi-value">{patient.umur}</span></div>
          <div><span className="pi-label">Paviliun: </span><span className="pi-value">{patient.paviliun} ({patient.kelas})</span></div>
          <div><span className="pi-label">Dokter: </span><span className="pi-value">{patient.dokter1}</span></div>
          <div><span className="pi-label">Tgl Masuk: </span><span className="pi-value">{formatDate(patient.tanggalMasuk)}</span></div>
        </div>

        {/* All Assessment Sections */}
        {assessmentSections.map((section, si) => (
          <div className="print-section" key={si}>
            <div className="print-section-title">{section.title}</div>
            <div className="print-section-body">
              <div className="print-field-grid">
                {section.fields.map((field) => {
                  const val = data[field.key] || "";
                  const isWide = field.type === "textarea" || field.type === "checkbox";
                  const displayVal = Array.isArray(val) ? val.join(", ") : (val || "-");
                  return (
                    <div key={field.key} className={`print-field ${isWide ? "print-field-wide" : ""}`}>
                      <span className="print-f-label">{field.label}{field.suffix ? ` (${field.suffix})` : ""}:</span>
                      <span className={`print-f-value ${!val ? "print-f-empty" : ""}`}>{displayVal}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Diagnosa Keperawatan */}
        {data.diagnosaKep && data.diagnosaKep.length > 0 && (
          <div className="print-section">
            <div className="print-section-title">Diagnosa Keperawatan</div>
            <div className="print-section-body">
              <table className="print-table">
                <thead>
                  <tr><th>No</th><th>Diagnosis Keperawatan</th><th>Etiologi</th><th>Prioritas</th></tr>
                </thead>
                <tbody>
                  {data.diagnosaKep.map((d: any, i: number) => (
                    <tr key={i}><td>{i+1}</td><td>{d.diagnosa || "-"}</td><td>{d.etiologi || "-"}</td><td>{d.prioritas || "-"}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rencana Keperawatan — Tujuan */}
        {data.rencanaKep && data.rencanaKep.length > 0 && (
          <div className="print-section">
            <div className="print-section-title">Rencana Keperawatan — Tujuan & Kriteria Evaluasi</div>
            <div className="print-section-body">
              <table className="print-table">
                <thead>
                  <tr><th>No</th><th>DP</th><th>Tujuan</th><th>Kriteria Evaluasi</th></tr>
                </thead>
                <tbody>
                  {data.rencanaKep.map((r: any, i: number) => (
                    <tr key={i}><td>{i+1}</td><td>{r.dp || "-"}</td><td>{r.tujuan || "-"}</td><td>{r.kriteria || "-"}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rencana Keperawatan — Intervensi */}
        {data.intervensiKep && data.intervensiKep.length > 0 && (
          <div className="print-section">
            <div className="print-section-title">Rencana Keperawatan — Intervensi & Edukasi</div>
            <div className="print-section-body">
              <table className="print-table">
                <thead>
                  <tr><th>No</th><th>DP</th><th>Mandiri</th><th>Kolaborasi</th><th>Edukasi</th></tr>
                </thead>
                <tbody>
                  {data.intervensiKep.map((iv: any, i: number) => {
                    const edukasiStr = [
                      ...(Array.isArray(iv.edukasi) ? iv.edukasi : []),
                      ...(iv.edukasiLain ? [iv.edukasiLain] : []),
                    ].join(", ") || "-";
                    return (
                      <tr key={i}><td>{i+1}</td><td>{iv.dp || "-"}</td><td>{iv.mandiri || "-"}</td><td>{iv.kolaborasi || "-"}</td><td>{edukasiStr}</td></tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Signature Area */}
        <div className="print-footer">
          <div className="print-sig-box">
            <div className="print-sig-title">DPJP / Dokter</div>
            <div className="print-sig-line">({data.dpjp || patient.dokter1})</div>
          </div>
          <div className="print-sig-box">
            <div className="print-sig-title">Perawat</div>
            <div className="print-sig-line">(________________________)</div>
          </div>
          <div className="print-sig-box">
            <div className="print-sig-title">Pasien / Keluarga</div>
            <div className="print-sig-line">(________________________)</div>
          </div>
        </div>
      </div>
    </>
  );
}
