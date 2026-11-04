import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
dotenv.config();

async function userAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "token missing",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "token verification failed",
      });
    }

    const user = await userModel.findOne({
      _id: decoded.id,
    });

    if (!user) {
      return res.status(401).json({
        message: "user doesnt exist",
      });
    }
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.log("error occured during token validation");
    return res.status(403).json({
      message: "user auth failed",
    });
  }
}

export default userAuth;
