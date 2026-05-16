import { prisma } from "@/lib/prisma";
import { CpptClientPage } from "./client-page";

export default async function CpptListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const cppts = await prisma.cppt.findMany({
    where: { patientId: id },
    orderBy: { tanggal: "desc" },
  });

  return <CpptClientPage patientId={id} initialCppts={cppts} />;
}
