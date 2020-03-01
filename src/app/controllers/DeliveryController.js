import { startOfDay, isAfter, isBefore } from 'date-fns';
import * as Yup from 'yup';

import Delivery from '../models/Delivery';

const MIN_HOUR = 8;
const MAX_HOUR = 18;

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({ where: { canceled_at: null } });
    return res.json(deliveries);
  }

  async partnerIndex(req, res) {
    const deliveries = await Delivery.findAll({
      where: {
        partner_id: req.params.partnerId,
        canceled_at: null,
        end_date: null,
      },
    });
    return res.json(deliveries);
  }

  async store(req, res) {
    if (req.body.signature_id) {
      return res.status(400).json({
        error:
          'You can not sign a delivery this way. Instead, use the update method',
      });
    }
    if (req.body.canceled_at) {
      return res.status(400).json({
        error:
          'You can not cancel a delivery this way. Instead, use the delete method',
      });
    }
    if (req.body.start_date) {
      return res.status(400).json({
        error:
          'You can not start a delivery this way. Instead, use the start method',
      });
    }
    if (req.body.end_date) {
      return res.status(400).json({
        error:
          'You can not end a delivery this way. Instead, use the end method',
      });
    }
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      partner_id: Yup.number().required(),
      product: Yup.string().required(),
    });
    try {
      // abortEarly = false to show all the errors found
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }
    const delivery = await Delivery.create(req.body);
    return res.json(delivery);
  }

  async update(req, res) {
    if (req.body.canceled_at) {
      return res.status(400).json({
        error:
          'You can not cancel a delivery this way. Instead, use the delete method',
      });
    }
    if (req.body.start_date) {
      return res.status(400).json({
        error:
          'You can not start a delivery this way. Instead, use the start method',
      });
    }
    if (req.body.end_date) {
      return res.status(400).json({
        error:
          'You can not end a delivery this way. Instead, use the end method',
      });
    }
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      partner_id: Yup.number(),
      product: Yup.string(),
    });
    try {
      // abortEarly = false to show all the errors found
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }
    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery has been canceled' });
    }
    const {
      id,
      product,
      canceled_at,
      start_date,
      end_date,
      createdAt,
      updatedAt,
      recipient_id,
      partner_id,
    } = await delivery.update(req.body);
    return res.json({
      id,
      product,
      canceled_at,
      start_date,
      end_date,
      createdAt,
      updatedAt,
      recipient_id,
      partner_id,
    });
  }

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
    const now = new Date();
    const lowerLimit = startOfDay(now).setHours(MIN_HOUR);
    const upperLimit = startOfDay(now).setHours(MAX_HOUR);

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

  async end(req, res) {
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

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }
    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been canceled' });
    }
    const { id, product, canceled_at } = await delivery.update({
      canceled_at: new Date(),
    });
    return res.json({
      id,
      product,
      canceled_at,
    });
  }
}

export default new DeliveryController();
