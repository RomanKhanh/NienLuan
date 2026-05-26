const {
  getNotificationsService,
  markAllReadService,
  deleteNotificationService,
  deleteAllNotificationsService,
} = require("../services/notificationService");

const getNotifications = async (req, res) => {
  try {
    const result = await getNotificationsService(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ EC: 1, EM: error.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    const result = await markAllReadService(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ EC: 1, EM: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const result = await deleteNotificationService(req.params.id, req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ EC: 1, EM: error.message });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    const result = await deleteAllNotificationsService(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ EC: 1, EM: error.message });
  }
};

module.exports = {
  getNotifications,
  markAllRead,
  deleteNotification,
  deleteAllNotifications,
};
