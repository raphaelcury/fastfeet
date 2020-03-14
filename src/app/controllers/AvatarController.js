import Avatar from '../models/Avatar';
import Partner from '../models/Partner';

class AvatarController {
  /* Creates a new avatar for a partner */
  async store(req, res) {
    const { originalname, filename } = req.file;
    const { partnerId } = req.params;
    // Checks whether the partner exists
    const partner = await Partner.findByPk(partnerId);
    if (!partner) {
      return res
        .status(400)
        .json({ error: `Partner ${partnerId} does not exist.` });
    }
    // Checks whether the partner already have an avatar
    const existingAvatars = await Avatar.findAll({
      where: { partner_id: partnerId },
    });
    if (existingAvatars.length > 0) {
      return res
        .status(400)
        .json({ error: `Partner ${partnerId} already has an avatar.` });
    }
    // Creates the new avatar
    const file = await Avatar.create({
      name: originalname,
      path: filename,
      partner_id: partnerId,
    });
    return res.json(file);
  }

  /* Updates a partner's avatar */
  /* async update(req, res) {
    existingAvatar.map(async avatar => {
      const { id } = await avatar.destroy();
      console.log(`Deleted ${id}`);
      return id;
    });
  } */
}

export default new AvatarController();
