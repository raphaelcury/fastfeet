import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  // Lists all the deliveries with a problem
  async index(req, res) {
    const problems = await DeliveryProblem.findAll();
    return res.json(problems);
  }
}

export default new DeliveryProblemController();
