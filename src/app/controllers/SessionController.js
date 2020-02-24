import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    try {
      // Validação da entrada
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string()
          .required()
          .min(6),
      });

      try {
        // abortEarly = false para mostrar todos os erros encontrados
        await schema.validate(req.body, { abortEarly: false });
      } catch (error) {
        return res.status(400).json({
          error: `Validation errors: ${JSON.stringify(error.errors)}`,
        });
      }

      // Procura email para validar senha
      const user = await User.findOne({ where: { email: req.body.email } });
      // Se usuário não encontrado, erro 401
      if (!user) {
        return res.status(401).json({ error: 'Incorrect User/Password' });
      }
      // Se senha errada, erro 401
      if (!(await user.verifyPassword(req.body.password))) {
        return res.status(401).json({ error: 'Incorrect User/Password' });
      }
      // Se email/senha ok, gera token de sessão com id de usuário e retorna
      // Payload é o id do usuário
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
    } catch (error) {
      return res.json({
        error: `${error}`,
      });
    }
  }
}

export default new SessionController();
