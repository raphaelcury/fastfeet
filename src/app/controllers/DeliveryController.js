import * as Yup from 'yup';

import Queue from '../../lib/Queue';

import DeliveryCreationMailJob from '../jobs/DeliveryCreationMailJob';
import DeliveryCancellationMailJob from '../jobs/DeliveryCancellationMailJob';

import Partner from '../models/Partner';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

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
    // Verifies whether the partner and recipient exist
    const partner = await Partner.findByPk(req.body.partner_id);
    if (!partner) {
      return res.status(400).json({ error: 'Partner does not exist.' });
    }
    const recipient = await Recipient.findByPk(req.body.recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exist.' });
    }

    const delivery = await Delivery.create(req.body);

    await Queue.add(DeliveryCreationMailJob.key, {
      delivery,
      partner,
      recipient,
    });

    return res.json(delivery);
  }

  // TODO: Update the delivery (admin)

  // Cancel delivery based on a problem
  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.problemId, {
      include: {
        model: Delivery,
        as: 'delivery',
        include: [
          {
            model: Partner,
            as: 'partner',
          },
          {
            model: Recipient,
            as: 'recipient',
          },
        ],
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

    await Queue.add(DeliveryCancellationMailJob.key, { problem });

    return res.json({
      id,
      product,
      canceled_at,
    });
  }
}

export default new DeliveryController();
