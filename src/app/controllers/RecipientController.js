import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    // Cria recipient
    try {
      const {
        id,
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      } = await Recipient.create(req.body);
      return res.json({
        id,
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      });
    } catch (error) {
      return res.json({
        error: `Erro BD: ${error}`,
      });
    }
  }

  async show(req, res) {
    try {
      const {
        id,
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      } = await Recipient.findOne({ where: { id: req.params.id } });
      return res.json({
        id,
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      });
    } catch (error) {
      return res.json({
        error: `Erro BD: ${error}`,
      });
    }
  }

  async update(req, res) {
    try {
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
    } catch (error) {
      return res.json({
        error: `Erro BD: ${error}`,
      });
    }
  }

  async delete(req, res) {
    try {
      const recipient = await Recipient.findByPk(req.params.id);
      if (!recipient) {
        // Bad request
        return res.status(400).json({ error: 'Recipient not found.' });
      }
      const { id } = await recipient.destroy();
      return res.json({
        msg: `Recipient id ${id} deleted.`,
      });
    } catch (error) {
      return res.json({
        error: `Erro BD: ${error}`,
      });
    }
  }
}

export default new RecipientController();
