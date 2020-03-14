import { Op } from 'sequelize';

import Delivery from '../models/Delivery';

class ClosedDeliveryController {
  /* Lists all closed deliveries */
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: {
        partner_id: req.params.partnerId,
        canceled_at: null,
        end_date: { [Op.ne]: null },
      },
    });
    return res.json(deliveries);
  }

  /* Ends a delivery */
  /* TODO: Verify if this method should be migrated to Delivery Controller */
  async update(req, res) {
    const delivery = await Delivery.findOne({
      where: { partner_id: req.params.partnerId, id: req.params.deliveryId },
    });
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }
    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery has been canceled' });
    }
    if (!delivery.start_date) {
      return res.status(400).json({ error: 'Delivery has not started' });
    }
    if (delivery.end_date) {
      return res.status(400).json({ error: 'Delivery has already ended' });
    }
    const { id, product, end_date } = await delivery.update({
      end_date: new Date(),
    });
    return res.json({ id, product, end_date });
  }
}

export default new ClosedDeliveryController();
