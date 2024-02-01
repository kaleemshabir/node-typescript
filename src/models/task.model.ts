import mongoose, { Model, model, Schema } from "mongoose";
import { ITask, ITaskModel } from "../interfaces/task.interface";
import paginate from "./plugins/paginate";

// ISSUE: Own every parameter and any missing dependencies
const TaskSchema = new Schema<ITask, ITaskModel>(
  {
    title: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    createdBy: {
      type:mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },

  },
  { timestamps: true }
);

TaskSchema.plugin(paginate);

export const Task: ITaskModel = model<ITask, ITaskModel>("Task", TaskSchema);
