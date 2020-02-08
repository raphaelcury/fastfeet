import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    // Cria recipient
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
  }

  show() {}

  update() {}

  delete() {}
}

export default new RecipientController();
