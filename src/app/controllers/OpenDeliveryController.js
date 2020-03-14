import Delivery from '../models/Delivery';
import Signature from '../models/Signature';

class OpenDeliveryController {
  /* Lists all open deliveries */
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: {
        partner_id: req.params.partnerId,
        canceled_at: null,
        end_date: null,
      },
    });
    return res.json(deliveries);
  }

  /* Ends a delivery */
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

export default new OpenDeliveryController();
