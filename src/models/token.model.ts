import { Model, model, Schema } from "mongoose";
import { IToken } from "../interfaces/token.interface";

// ISSUE: Own every parameter and any missing dependencies
const TokenSchema = new Schema(
  {
    generationTime: Date,
    token: String,
  },
  { timestamps: true }
);

export const Token: Model<IToken> = model<IToken>("Token", TokenSchema);
