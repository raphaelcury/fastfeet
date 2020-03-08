import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  /* Creates an user session */
  async store(req, res) {
    // Input validation
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    try {
      // abortEarly = false to show all the errors found
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({
        errors: error.errors,
      });
    }
    // Looks for user for password validation
    const user = await User.findOne({ where: { email: req.body.email } });
    // User not found
    if (!user) {
      return res.status(401).json({ error: 'Incorrect User/Password' });
    }
    // Wrong password
    if (!(await user.verifyPassword(req.body.password))) {
      return res.status(401).json({ error: 'Incorrect User/Password' });
    }
    // Creates session token with user id
    const { id, name, email } = user;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token,
    });
  }
}

export default new SessionController();
