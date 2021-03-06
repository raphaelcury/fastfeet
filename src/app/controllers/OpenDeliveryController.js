import { startOfDay, endOfDay, isAfter, isBefore } from 'date-fns';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Signature from '../models/Signature';

const MAX_DELIVERIES_PER_DAY = 5;

const MIN_HOUR = 8;
const MAX_HOUR = 18;

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

  /* Starts a delivery */
  async start(req, res) {
    const delivery = await Delivery.findOne({
      where: { partner_id: req.params.partnerId, id: req.params.deliveryId },
    });
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }
    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery has been canceled' });
    }
    if (delivery.start_date) {
      return res.status(400).json({ error: 'Delivery has already started' });
    }

    // Partner can only start MAX_DELIVERIES_PER_DAY deliveries per day
    const now = new Date();
    const dayStart = startOfDay(now);
    const dayEnd = endOfDay(now);
    const dayDeliveries = await Delivery.findAll({
      where: {
        partner_id: req.params.partnerId,
        start_date: {
          [Op.between]: [dayStart, dayEnd],
        },
      },
    });
    if (dayDeliveries && dayDeliveries.length >= MAX_DELIVERIES_PER_DAY) {
      return res.status(400).json({
        error: `Partner can start only ${MAX_DELIVERIES_PER_DAY} deliveries per day`,
      });
    }

    // Deliveries can only start between MIN_HOUR and MAX_HOUR
    const lowerLimit = dayStart.setHours(MIN_HOUR);
    const upperLimit = dayStart.setHours(MAX_HOUR);
    if (isBefore(now, lowerLimit) || isAfter(now, upperLimit)) {
      return res.status(400).json({
        error: `Deliveries can only start between ${MIN_HOUR}:00 and ${MAX_HOUR}:00`,
      });
    }
    const { id, product, start_date } = await delivery.update({
      start_date: now,
    });
    return res.json({ id, product, start_date });
  }

  /* Ends a delivery */
  async end(req, res) {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'Signature file not found on request' });
    }
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
