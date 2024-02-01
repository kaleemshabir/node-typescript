import { NextFunction, Request, Response, Router } from "express";

import * as jwt from "jsonwebtoken";
import { User } from "../models/user.model";

import { asyncHandler } from "./async";
import { JwtPayload } from "jsonwebtoken";
import * as mongoose from "mongoose";

const getToken = (req: Request, res: Response) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    // Set token from cookie
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json("Not authorized to access this route");
  }
  // Verify token
  const decoded = jwt.verify(
    token,
    process.env.AUTH_SECRET || "slkjdflkjslkdjflksjdf"
  );
  return decoded;
};
// Protect routes
export const protect = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const decoded = getToken(req, res);
      const id = (decoded as JwtPayload).id;

      console.log("user_", id);
      const user = await User.findById(new mongoose.Types.ObjectId(id));
      req.user = user;

      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json("Not authorized to access this route");
    }
  }
);

// Grant access to specific roles
export const authorize = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.isAdmin) next();
  else return res.status(401).json("Not authorized to access this route");
};
