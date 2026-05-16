import { prisma } from "@/lib/prisma";
import { LabClientPage } from "./client-page";

export default async function LabResultListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const labResults = await prisma.labResult.findMany({
    where: { patientId: id },
    orderBy: { tanggal: "desc" },
  });

  return <LabClientPage patientId={id} initialLabs={labResults} />;
}
