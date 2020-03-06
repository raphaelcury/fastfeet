import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  // Lists all the deliveries with a problem
  async index(req, res) {
    const problems = await DeliveryProblem.findAll();
    return res.json(problems);
  }

  async store(req, res) {
    const problem = await DeliveryProblem.create({
      ...req.body,
      delivery_id: req.params.deliveryId,
    });
    return res.json(problem);
  }
}

export default new DeliveryProblemController();
