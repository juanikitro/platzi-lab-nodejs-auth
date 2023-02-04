import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/User.js';

export const updateUser = Router();

updateUser.put('/', async (request, response) => {
  try {
    if (request.body.password) {
      const salt = await bcrypt.genSalt(10);
      request.body.password = await bcrypt.hash(request.body.password, salt);
    }
    let user = jwt.decode(
      request.header('auth-token'),
      process.env.TOKEN_SECRET
    ).username;

    user = await UserModel.findOne({ user });

    await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: request.body,
      }
    ).then(async () => {
      user = await UserModel.findOne({ user });
    });

    return response.status(200).json({ user });
  } catch (error) {
    console.error(`[viewUser]: ${error}`);

    return response.status(500).json({
      error: 'An unexpected error happened. Please try again later',
    });
  }
});
