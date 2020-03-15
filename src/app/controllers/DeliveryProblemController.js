import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  /* List all problems from a delivery */
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: { delivery_id: req.params.deliveryId },
    });
    return res.json(problems);
  }

  /* Creates a new delivery problem */
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });
    try {
      // abortEarly = false to show all the errors found
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }
    const problem = await DeliveryProblem.create({
      ...req.body,
      delivery_id: req.params.deliveryId,
    });
    return res.json(problem);
  }
}

export default new DeliveryProblemController();
