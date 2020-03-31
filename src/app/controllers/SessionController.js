import jwt from 'jsonwebtoken';
import * as yup from 'yup';

import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Um ou mais campos estão incorretos' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Dados inválidos - Usuário ou Senha incorreto!' });
    };

    const { id, name } = user;
    const { secret, expiresIn } = authConfig;

    return res.json({
      user: { id, name, email },
      token: jwt.sign({ id }, secret, { expiresIn }),
    });
  };
};

export default new SessionController();