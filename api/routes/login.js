import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { UserModel } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = Router();

login.post(
  '/',
  // Validación y sanitización de los datos de entrada
  body('username').not().isEmpty().trim(),
  body('password').isLength({ min: 6 }),

  //
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const { username, password } = request.body;

      const user = await UserModel.findOne({ username });

      if (!user) {
        return response.status(400).json({
          error: 'username or password is incorrect',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return response.status(400).json({
          error: 'username or password is incorrect',
        });
      }

      const token = jwt.sign(
        {
          username: username,
          id: user._id,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '12h',
        }
      );

      return response.status(201).json({ token, username: user.username });
    } catch (error) {
      console.error(`[signIn]: ${error}`);

      return response.status(500).json({
        error: 'An unexpected error happened. Please try again later',
      });
    }
  }
);
