import { Router } from "express";
import { sample_users } from "../data";
import jwt, { Secret } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await UserModel.create(sample_users);
    res.send("Seed Is Done!");
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    const dbUser = (await UserModel.create(user)).toObject();

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(res.json({ ...dbUser, token: generateToken({ email }) }));
    } else {
      console.log("error");

      res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
    }
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, address, isAdmin } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(HTTP_BAD_REQUEST).send("User is already exist, please login!");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin,
    };

    const dbUser = (await UserModel.create(newUser)).toObject();

    res.send(res.json({ ...dbUser, token: generateToken({ email }) }));
  })
);

dotenv.config();

export const generateToken = (payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as Secret);
  return token;
};
export default router;
