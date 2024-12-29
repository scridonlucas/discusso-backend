import prisma from '../utils/prismaClient';

const getUserNotifications = async (userId: number) => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
  });
  return notifications;
};

const markNotificationAsRead = async (notificationId: number) => {
  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
  return notification;
};

const markAllNotificationsAsRead = async (userId: number) => {
  const notifications = await prisma.notification.updateMany({
    where: { userId },
    data: { isRead: true },
  });
  return notifications;
};
const createNotification = async (
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

export default {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
