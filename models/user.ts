import { Schema, model, models, Document, Model } from "mongoose";

interface IUser extends Document {
  userIdTiktok: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  team: string | null;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  userIdTiktok: {
    type: String,
  },
  uniqueId: {
    type: String,
  },
  nickname: {
    type: String,
  },
  profilePictureUrl: {
    type: String,
  },
  team: {
    type: String,
    default: null, 
  },
  createdAt: {
    type: Date,
  },
});

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;
