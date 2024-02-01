import { Model, model, Schema } from "mongoose";
import { IUser } from "../interfaces/user-interface";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
interface IProcessEnv {
  process: {
    env: object;
  };
}

// ISSUE: Own every parameter and any missing dependencies
const UserSchema = new Schema(
  {
    id: {
      type: Schema.Types.String,
    },
    email: {
      type: Schema.Types.String,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: {
      type: Schema.Types.String,
      required: [true, "can't be blank"],
    },
    registrationToken: {
      generationTime: Date,
      token: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.AUTH_SECRET || "slkjdflkjslkdjflksjdf",
    {
      expiresIn: "2d",
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> = model<IUser>("User", UserSchema);
