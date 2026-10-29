import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

async function registerUser(req, res) {
  // req example  {username, email, password, role = "user"}
  try {
    //?? means “use the value on the right if the value on the left is null or undefined.”
    const { username, email, password, role = "user" } = req.body ?? {};

    //INPUT VALIDATION
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Username, email, and password are required strings",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        message: "password must be atleast 12 characters and at most 72 bytes",
      });
    }

    if (role !== "user" && role !== "artist") {
      return res.status(400).json({
        message: "invalid role",
      });
    }

    const existingUser = await userModel.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    //bcrypts limit is 72 bytes
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hash,
      role,
    });

    return res.status(201).json({
      message: "user successfully registered",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    //11000 is MongoDB’s duplicate-key error—for example, saving an email that already exists when that field has a unique index.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    return res.status(500).json({
      message: "something went wrong",
    });
  }
}

async function loginUser(req, res) {
  // req example  { identifier: "username/email", password : "password"}
  try {
    const { identifier, password } = req.body ?? {};
    //INPUT VALIDATION
    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      password.length === 0
    ) {
      return res.status(400).json({
        message: "Username, email, and password are required strings",
      });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const user = await userModel.findOne({
      $or: [
        { username: normalizedIdentifier },
        { email: normalizedIdentifier },
      ],
    });

    if (!user) {
      return res.status(401).json({
        messsage: "Invalid Credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "wrong password",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "login Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("error while logging in", error);
    return res.status(500).json({
      message: "server error",
    });
  }
}
async function logoutUser(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res.status(200).json({
    message: "Logged out successfully",
  });
}

export default { registerUser, loginUser, logoutUser };
