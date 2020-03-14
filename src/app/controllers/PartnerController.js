import { Op } from 'sequelize';
import * as Yup from 'yup';

import Partner from '../models/Partner';
import Avatar from '../models/Avatar';

class PartnerController {
  /* Lists all partners */
  async index(req, res) {
    const partners = await Partner.findAll({
      attributes: ['id', 'name', 'email'],
      include: {
        model: Avatar,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    });
    return res.json(partners);
  }

  /* Creates a new partner */
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });
    try {
      // abortEarly = false to show all the errors found
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ validationErrors: error.errors });
    }
    /* If it has avatar_id, verifies if the avatar exists and if this avatar
       already does not belong to another partner */
    if (req.body.avatar_id) {
      const avatar = await Avatar.findByPk(req.body.avatar_id);
      if (!avatar) {
        return res.status(400).json({ error: 'Avatar does not exist.' });
      }
      const partnerWithSameAvatar = await Partner.findOne({
        where: {
          avatar_id: req.body.avatar_id,
        },
      });
      if (partnerWithSameAvatar) {
        return res
          .status(400)
          .json({ error: 'Avatar already belongs to other partner' });
      }
    }
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

  /* Updates a partner */
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });
    try {
      // abortEarly = false to show all the errors found
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ validationErrors: error.errors });
    }
    // Verifies whether the partner exists
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(400).json({ error: 'Partner does not exist' });
    }
    /* If it has avatar_id, verifies if the avatar exists and if this avatar
       already does not belong to another partner */
    if (req.body.avatar_id) {
      const avatar = await Avatar.findByPk(req.body.avatar_id);
      if (!avatar) {
        return res.status(400).json({ error: 'Avatar does not exist.' });
      }
      const partnerWithSameAvatar = await Partner.findOne({
        where: {
          id: { [Op.not]: req.params.id },
          avatar_id: req.body.avatar_id,
        },
      });
      if (partnerWithSameAvatar) {
        return res
          .status(400)
          .json({ error: 'Avatar already belongs to other partner' });
      }
    }
    // Verifies if is there another partner with same email
    if (req.body.email) {
      const partnerWithSameEmail = await Partner.findOne({
        where: {
          id: { [Op.not]: req.params.id },
          email: req.body.email,
        },
      });
      if (partnerWithSameEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    // Finally, updates the partner
    const { id, name, email, createdAt, updatedAt } = await partner.update(
      req.body
    );
    return res.json({ id, name, email, createdAt, updatedAt });
  }

  /* Deletes a partner */
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
