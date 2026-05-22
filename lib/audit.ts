import { prisma } from './prisma';
import { getSession } from './session';

export async function logAudit(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  entity: 'Patient' | 'InitialAssessment' | 'Resume' | 'Cppt' | 'LabResult' | 'User' | 'AiSummary' | 'Observation',
  entityId: string,
  changes: any
) {
  try {
    const session = await getSession();
    if (!session) {
      console.warn('Audit log failed: No active session');
      return;
    }

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action,
        entity,
        entityId,
        changes,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
