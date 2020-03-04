class DeliveryProblemController {
  // Lists all the deliveries with a problem
  async index(req, res) {
    return res.json({ ok: true });
  }
}

export default new DeliveryProblemController();
