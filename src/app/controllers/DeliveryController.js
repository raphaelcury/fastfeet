import { startOfDay, endOfDay, isAfter, isBefore } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';

// TODO: Input validation

import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

const MAX_DELIVERIES_PER_DAY = 5;

const MIN_HOUR = 8;
const MAX_HOUR = 18;

/* Filters deliveries with or without problems */
async function deliveryFilter(withProblem) {
  // First, get all deliveries
  const allDeliveries = await Delivery.findAll({
    where: {
      end_date: null,
      canceled_at: null,
    },
    include: {
      model: DeliveryProblem,
      as: 'problems',
    },
  });
  // Filter the deliveries
  const deliveries = allDeliveries.filter(delivery => {
    const hasProblems = delivery.problems.length > 0;
    return withProblem ? hasProblems : !hasProblems;
  });
  return deliveries;
}

class DeliveryController {
  /* Lists all the deliveries, deliveries with a problem, or deliveries without
     a problem */
  async index(req, res) {
    let deliveries = [];
    if (req.query.withProblem === 'true') {
      // Only deliveries with a problem
      deliveries = await deliveryFilter(true);
    } else if (req.query.withProblem === 'false') {
      // Only deliveries without a problem
      deliveries = await deliveryFilter(false);
    } else {
      // All not canceled deliveries
      deliveries = await Delivery.findAll({ where: { canceled_at: null } });
    }
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

  /* Starts a delivery */
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

  // Cancel delivery based on a problem
  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.problemId, {
      include: {
        model: Delivery,
        as: 'delivery',
      },
    });
    if (!problem) {
      return res.status(400).json({ error: 'Problem does not exist' });
    }
    if (!problem.delivery) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }
    if (problem.delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been canceled' });
    }
    const { id, product, canceled_at } = await problem.delivery.update({
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
