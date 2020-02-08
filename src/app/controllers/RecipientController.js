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
        error: `Erro DB: ${error}`,
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
        error: `Erro Consulta BD: ${error}`,
      });
    }
  }

  update() {}

  delete() {}

  index() {}
}

export default new RecipientController();
