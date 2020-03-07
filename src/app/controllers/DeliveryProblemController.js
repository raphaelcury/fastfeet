import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  // Creates a new delivery problem
  async store(req, res) {
    const problem = await DeliveryProblem.create({
      ...req.body,
      delivery_id: req.params.deliveryId,
    });
    return res.json(problem);
  }
}

export default new DeliveryProblemController();
