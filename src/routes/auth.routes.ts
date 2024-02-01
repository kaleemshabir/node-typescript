import { NextFunction, Request, Response, Router } from "express";
import { authorize, protect } from "../middleware/auth";
import { User } from "../models/user.model";
import { asyncHandler } from "../middleware/async";
import { Token } from "../models/token.model";
import * as crypto from "crypto";

const router: Router = Router();

/**
 * GET /api/user
 */
router.get(
  "/user",
  protect,
  asyncHandler(async (req: Request | any, res: Response) => {
    const user = req.user;
    res.status(200).json({
      user: { id: user.id, email: user.email },
    });
  })
);

/**
 * POST /register/:token
 */
router.post(
  "/register/:token",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;
    const { email, password } = req.body;

    // Retrieve token's generation time from the database
    const tokenData = await Token.findOne({ token: token });

    if (!tokenData) {
      return res.status(404).json({ message: "Token not found" });
    }

    const generationTime = tokenData.generationTime;
    const expirationTime = new Date(generationTime);
    expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Assuming token expires after 1 hour

    const currentTime = new Date();

    if (currentTime > expirationTime) {
      return res.json({ expired: true, message: "Token has expired" });
    } else {
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({ message: "this email taken!" });
      }
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Password and email are required fields" });
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Email must be valid" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long!" });
      }

      user = await User.create({
        email,
        password,
      });
     await Token.remove({ token: token });
      user = user.toObject();
      user._id = undefined;
      res.status(201).json({ user });
      // return res.json({ expired: false, message: "Token is still valid" });
    }
  })
);

// ISSUE: How does this work with the trailing (req, res, next)?
/**
 * POST /api/users/login
 */
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validate emil & password
    if (!email || !password) {
      return res.status(400).json("Please provide an email and password");
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password +_id");

    if (!user) {
      return res.status(401).json("Invalid credentials");
    }

    // Check if password matches
    const isMatch =  user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json("Invalid credentials");
    }
    // Create token
    const token = user.getSignedJwtToken();
    res.status(200).json({ jwt: token });
  })
);

router.get(
  "/invite",
  protect,
  authorize,
  async (req: Request, res: Response) => {
    const token = crypto.randomBytes(20).toString("hex");

    const generationTime = new Date();

    await Token.create({
      token,
      generationTime,
    });

    // Create reset url
    const url = `${req.protocol}://${req.get(
      "host"
    )}/auth/register/${token}`;

    res.status(200).json({ url });
  }
);

export const AuthRoutes: Router = router;
