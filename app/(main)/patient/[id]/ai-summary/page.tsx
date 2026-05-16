import { prisma } from "@/lib/prisma";
import { AiSummaryClient } from "./client-page";

export default async function AiSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const latestSummary = await prisma.aiSummary.findFirst({
    where: { patientId: id },
    orderBy: { createdAt: "desc" },
  });

  return <AiSummaryClient patientId={id} initialSummary={latestSummary} />;
}
