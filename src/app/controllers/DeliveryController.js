import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryController {
  /* TODO: unify open and closed controllers here. Start and end methods
     should be transformed into an update method, with a query parameter type
  */

  // Lists all the deliveries, or deliveries with a problem
  async index(req, res) {
    let deliveries = [];
    if (req.query.withProblem === 'true') {
      // Only deliveries with a problem
      const deliveryProblems = await DeliveryProblem.findAll({
        include: {
          model: Delivery,
          as: 'delivery',
        },
      });
      const deliveriesWithDuplicates = deliveryProblems.map(problem => {
        return problem.delivery;
      });
      deliveries = deliveriesWithDuplicates.filter(
        (delivery, index) =>
          index ===
          deliveriesWithDuplicates.findIndex(value => value.id === delivery.id)
      );
    } else if (req.query.withProblem === 'false') {
      // Only deliveries without a problem
      // First, get deliveries with problems
      const deliveryProblems = await DeliveryProblem.findAll({
        include: {
          model: Delivery,
          as: 'delivery',
        },
      });
      const deliveriesWithDuplicates = deliveryProblems.map(problem => {
        return problem.delivery;
      });
      const deliveriesWithProblems = deliveriesWithDuplicates.filter(
        (delivery, index) =>
          index ===
          deliveriesWithDuplicates.findIndex(value => value.id === delivery.id)
      );
      // Second, get all deliveries
      const allDeliveries = await Delivery.findAll({
        where: { canceled_at: null },
      });

      // Filter only the deliveries that have not problems
      deliveries = allDeliveries.filter(delivery => {
        const deliveryWithProblem = deliveriesWithProblems.find(
          value => value.id === delivery.id
        );
        return !deliveryWithProblem;
      });
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
