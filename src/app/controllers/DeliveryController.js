import Delivery from '../models/Delivery';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll();
    return res.json(deliveries);
  }

  async show(req, res) {
    const deliveries = await Delivery.findAll();
    return res.json(deliveries);
  }

  async store(req, res) {
    const delivery = await Delivery.create(req.body);
    return res.json(delivery);
  }

  async update(req, res) {
    const deliveries = await Delivery.findAll();
    return res.json(deliveries);
  }

  async delete(req, res) {
    const deliveries = await Delivery.findAll();
    return res.json(deliveries);
  }
}

export default new DeliveryController();
