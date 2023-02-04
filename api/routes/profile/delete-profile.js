import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/User.js';

export const deleteUser = Router();

deleteUser.delete('/', async (request, response) => {
  try {
    let user = jwt.decode(
      request.header('auth-token'),
      process.env.TOKEN_SECRET
    ).username;

    user = await UserModel.deleteOne({ user });

    return response.status(200).json({ user });
  } catch (error) {
    console.error(`[viewUser]: ${error}`);

    return response.status(500).json({
      error: 'An unexpected error happened. Please try again later',
    });
  }
});
