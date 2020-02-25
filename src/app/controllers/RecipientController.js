import * as Yup from 'yup';

import Recipient from '../models/Recipient';

const stateRegEx = /^[A-Z]{2}$/;
const errorMessageStateRegEx = 'State must be 2 capital letters';

class RecipientController {
  async store(req, res) {
    // Validação da entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string()
        .required()
        .matches(stateRegEx, errorMessageStateRegEx),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    try {
      // abortEarly = false para mostrar todos os erros encontrados
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({
        error: `Validation errors: ${JSON.stringify(error.errors)}`,
      });
    }

    // Cria recipient

    const {
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);
    return res.json({
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async index(req, res) {
    const recipientList = await Recipient.findAll();

    return res.json({
      recipientList,
    });
  }

  async show(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);
    if (!recipient) {
      // Bad request
      return res.status(400).json({ error: 'Recipient not found.' });
    }

    const {
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    } = recipient;

    return res.json({
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);
    if (!recipient) {
      // Bad request
      return res.status(400).json({ error: 'Recipient not found.' });
    }

    // Validação da entrada
    const schema = Yup.object().shape({
      name: Yup.string(),
      address: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string()
        .required()
        .matches(stateRegEx, errorMessageStateRegEx),
      city: Yup.string(),
      zip_code: Yup.string(),
    });

    try {
      // abortEarly = false para mostrar todos os erros encontrados
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({
        error: `Validation errors: ${JSON.stringify(error.errors)}`,
      });
    }

    const {
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);
    return res.json({
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);
    if (!recipient) {
      // Bad request
      return res.status(400).json({ error: 'Recipient not found.' });
    }
    const { id } = await recipient.destroy();
    return res.json({
      msg: `Recipient id ${id} deleted.`,
    });
  }
}

export default new RecipientController();
