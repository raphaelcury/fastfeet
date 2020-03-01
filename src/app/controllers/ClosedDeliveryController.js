import { Op } from 'sequelize';

import Delivery from '../models/Delivery';

class ClosedDeliveryController {
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
}

export default new ClosedDeliveryController();
