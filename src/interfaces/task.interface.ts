import mongoose, { Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  status: string;
  createdBy: {
    type: mongoose.Types.ObjectId;
    isRequired: true;
  };
}
export interface ITaskModel extends Model<ITask> {
  paginate(filter: object, options: object): Promise<any>; // Define paginate method
}
