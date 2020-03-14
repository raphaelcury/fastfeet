import DeliveryProblem from '../models/DeliveryProblem';

// TODO: Input validation

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
    const problem = await DeliveryProblem.create({
      ...req.body,
      delivery_id: req.params.deliveryId,
    });
    return res.json(problem);
  }
}

export default new DeliveryProblemController();
