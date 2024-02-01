import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  isAdmin: boolean;
  matchPassword(enteredPassword: string): boolean;
  getSignedJwtToken(): string;
}
