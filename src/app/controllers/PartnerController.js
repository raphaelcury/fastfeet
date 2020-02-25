import { Op } from 'sequelize';
import Partner from '../models/Partner';

class PartnerController {
  async index(req, res) {
    const partners = await Partner.findAll();
    return res.json(partners);
  }

  async show(req, res) {
    const { id } = req.params;
    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(400).json({ error: 'Partner does not exist' });
    }
    return res.json(partner);
  }

  async store(req, res) {
    const partnerWithSameEmail = await Partner.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (partnerWithSameEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const newPartner = await Partner.create(req.body);
    return res.json({ newPartner });
  }

  async update(req, res) {
    const { id } = req.params;
    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(400).json({ error: 'Partner does not exist' });
    }
    const partnerWithSameEmail = await Partner.findOne({
      where: {
        id: { [Op.not]: id },
        email: req.body.email,
      },
    });
    if (partnerWithSameEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const { name, email, createdAt, updatedAt } = await partner.update(
      req.body
    );
    return res.json({ id, name, email, createdAt, updatedAt });
  }

  async delete(req, res) {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(400).json({ error: 'Partner does not exist' });
    }
    const { id } = await partner.destroy();
    return res.json({ msg: `Partner id ${id} deleted.` });
  }
}

export default new PartnerController();
