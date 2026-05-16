import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditPatientClientPage } from "./client-page";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const patient = await prisma.patient.findUnique({
    where: { id }
  });

  if (!patient) return notFound();

  return <EditPatientClientPage patient={patient} />;
}
