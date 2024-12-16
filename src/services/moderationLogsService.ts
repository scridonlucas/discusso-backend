import prisma from '../utils/prismaClient';

const addModerationLog = async (
  adminId: number,
  userId: number | null,
  action: string,
  targetId: number | null
) => {
  const log = await prisma.moderationLog.create({
    data: {
      adminId,
      userId,
      action,
      targetId,
    },
  });

  return log;
};

const getModerationLogs = async () => {
  const logs = await prisma.moderationLog.findMany();
  return logs;
};

export default {
  addModerationLog,
  getModerationLogs,
};
