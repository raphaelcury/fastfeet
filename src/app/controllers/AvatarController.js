import Avatar from '../models/Avatar';

class AvatarController {
  async store(req, res) {
    const { originalname, filename } = req.file;
    const file = await Avatar.create({
      name: originalname,
      path: filename,
    });
    return res.json(file);
  }
}

export default new AvatarController();
