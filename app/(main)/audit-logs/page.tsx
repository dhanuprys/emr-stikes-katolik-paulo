import { prisma } from "@/lib/prisma";
import { AuditLogsClient } from "./client-page";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  // Fetch the last 100 audit logs
  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  // Fetch all users to map userId to user name
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user.name;
    return acc;
  }, {} as Record<string, string>);

  // Attach user names to logs
  const logsWithUsers = logs.map((log) => ({
    ...log,
    userName: userMap[log.userId] || "Unknown User",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Log Audit Sistem</h1>
        <p className="text-muted-foreground">
          Menampilkan 100 aktivitas terakhir dalam sistem rekam medis.
        </p>
      </div>
      
      <AuditLogsClient initialLogs={logsWithUsers} />
    </div>
  );
}
