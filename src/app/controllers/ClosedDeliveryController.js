import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Signature from '../models/Signature';

// TODO: Input validation

class ClosedDeliveryController {
  /* Lists all closed deliveries */
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      attributes: [
        'id',
        'product',
        'start_date',
        'end_date',
        'createdAt',
        'recipient_id',
      ],
      where: {
        partner_id: req.params.partnerId,
        canceled_at: null,
        end_date: { [Op.ne]: null },
      },
      include: {
        model: Signature,
        as: 'signature',
        attributes: ['name', 'path', 'url'],
      },
    });
    return res.json(deliveries);
  }
}

export default new ClosedDeliveryController();
