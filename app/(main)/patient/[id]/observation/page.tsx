import { prisma } from "@/lib/prisma";
import { ObservationClientPage } from "./client-page";

export default async function ObservationListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const observations = await prisma.observation.findMany({
    where: { patientId: id },
    orderBy: { tanggal: "desc" },
    include: {
      user: {
        select: {
          name: true,
        }
      }
    }
  });

  return <ObservationClientPage patientId={id} initialObservations={observations} />;
}
