import { prisma } from "@/lib/prisma";
import { ApiKeysClient } from "./client-page";

export default async function ApiKeysPage() {
  const keys = await prisma.apiKey.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ApiKeysClient initialKeys={keys} />;
}
