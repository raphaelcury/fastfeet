import Avatar from '../models/Avatar';

class AvatarController {
  /* Creates a new avatar for a partner */
  async store(req, res) {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'Avatar file not found on request' });
    }
    const { originalname, filename } = req.file;
    // Creates the new avatar
    const file = await Avatar.create({
      name: originalname,
      path: filename,
    });
    return res.json(file);
  }
}

export default new AvatarController();
