import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Signature from '../models/Signature';

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

  /* Ends a delivery */
  /* TODO: Verify if this method should be migrated to Delivery Controller */
  async update(req, res) {
    // Gets the signature file data
    const { originalname, filename } = req.file;
    // Creates the new signature
    const signature = await Signature.create({
      name: originalname,
      path: filename,
    });
    const delivery = await Delivery.findOne({
      where: { partner_id: req.params.partnerId, id: req.params.deliveryId },
    });
    // TODO: Signature creation rollback in case of error in Delivery update
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
    const { id, product, end_date, signature_id } = await delivery.update({
      end_date: new Date(),
      signature_id: signature.id,
    });
    return res.json({ id, product, end_date, signature_id });
  }
}

export default new ClosedDeliveryController();
