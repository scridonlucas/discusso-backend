import 'express-async-errors';
import { Router } from 'express';
import middleware from '../utils/middleware';
import notificationService from '../services/notificationService';

const notificationsRouter = Router();

notificationsRouter.get(
  '/',
  middleware.jwtVerify,
  middleware.checkPermission('GET_OWN_NOTIFICATIONS'),
  async (req, res) => {
    const userId = req.decodedToken.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const notifications = await notificationService.getUserNotifications(
      userId
    );

    if (!notifications) {
      return res.status(404).json({ error: 'Notifications not found' });
    }

    return res.status(200).json(notifications);
  }
);

notificationsRouter.patch(
  '/read-all',
  middleware.jwtVerify,
  middleware.checkPermission('UPDATE_OWN_NOTIFICATIONS'),
  async (req, res) => {
    const userId = req.decodedToken.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const notification = await notificationService.markAllNotificationsAsRead(
      userId
    );

    return res.status(200).json(notification);
  }
);

notificationsRouter.patch(
  '/:notificationId/read',
  middleware.jwtVerify,
  middleware.checkPermission('UPDATE_OWN_NOTIFICATIONS'),
  async (req, res) => {
    const userId = req.decodedToken.id;
    const notificationId = Number(req.params.notificationId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!notificationId || isNaN(notificationId)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }

    const notification = await notificationService.markNotificationAsRead(
      notificationId
    );

    return res.status(200).json(notification);
  }
);
export default notificationsRouter;
