import User from '../models/User';
import * as yup from 'yup';

class UserController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Um ou mais campos estão incorretos' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'O usuário já tem cadastro!' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ success: true, data: { id, name, email } });
  };

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      oldPassword: yup.string(),
      password: yup.string().min(6).when('oldPassword', (oldPassword, field) => 
          !!oldPassword ? field.required() : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Um ou mais campos estão incorretos' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!!email && (email !== user.email)) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'O usuário já tem cadastro!' });
      };
    }

    if (!!oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'A senha anterior está incorreta' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({ success: true, data: { id, name, email } });
  }
};

export default new UserController();