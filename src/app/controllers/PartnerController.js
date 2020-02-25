class PartnerController {
  async index(req, res) {
    return res.json({ index: true });
  }

  async show(req, res) {
    return res.json({ show: true });
  }

  async store(req, res) {
    return res.json({ store: true });
  }

  async update(req, res) {
    return res.json({ update: true });
  }

  async delete(req, res) {
    return res.json({ delete: true });
  }
}

export default new PartnerController();
