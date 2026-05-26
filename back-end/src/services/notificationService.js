const Notification = require("../models/notification");

const createNotification = async (
  io,
  { recipientId, senderId, type, postId },
) => {
  if (recipientId.toString() === senderId.toString()) return;

  const notification = await Notification.create({
    recipientId,
    senderId,
    type,
    postId,
  });
  const populated = await Notification.findById(notification._id)
    .populate("senderId", "name avatar")
    .populate("postId", "description images");

  // Emit real-time đến đúng room của user nhận thông báo
  if (io) {
    io.to(`user_${recipientId}`).emit("new_notification", populated);
  }

  return populated;
};

const getNotificationsService = async (userId) => {
  const notifications = await Notification.find({ recipientId: userId })
    .sort({ createdAt: -1 })
    .limit(30)
    .populate("senderId", "name avatar")
    .populate("postId", "description images");
  return { EC: 0, NOTIFICATIONS: notifications };
};

const markAllReadService = async (userId) => {
  await Notification.updateMany(
    { recipientId: userId, isRead: false },
    { isRead: true },
  );
  return { EC: 0, EM: "Marked all as read" };
};

const deleteNotificationService = async (notificationId, userId) => {
  await Notification.deleteOne({ _id: notificationId, recipientId: userId });
  return { EC: 0, EM: "Deleted" };
};

const deleteAllNotificationsService = async (userId) => {
  await Notification.deleteMany({ recipientId: userId });
  return { EC: 0, EM: "Deleted all" };
};

module.exports = {
  createNotification,
  getNotificationsService,
  markAllReadService,
  deleteNotificationService,
  deleteAllNotificationsService,
};
