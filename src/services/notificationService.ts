import prisma from '../utils/prismaClient';

export const createNotification = async (
  recipientUserId: number,
  type: string,
  content: string
) => {
  const notification = prisma.notification.create({
    data: {
      userId: recipientUserId,
      type,
      content,
    },
  });

  return notification;
};

export default { createNotification };
