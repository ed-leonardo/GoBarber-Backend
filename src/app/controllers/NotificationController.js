import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notifications)
  }

  async update(req, res) {
    const notification = await Notification.findById(
      req.params.id
    );

    if (notification.user !== req.userId) {
      return res
        .status(401)
        .json({ error: "You can't read notification of the others providers" })
    }

    notification.read = true;
    notification.new = true;
    await notification.save();

    return res.json(notification)
  }
}

export default new NotificationController();
