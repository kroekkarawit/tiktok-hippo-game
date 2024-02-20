import { Schema, model, models, Document, Model } from "mongoose";

interface ILike extends Document {
  userId: Schema.Types.ObjectId;
  likeCount: number;
  userIdTiktok: string;
  uniqueId: string;
  team: string;
  createdAt: Date;
}

const LikeSchema: Schema<ILike> = new Schema({
  userId: {
    type: String,
  },
  userIdTiktok: {
    type: String,
  },
  uniqueId: {
    type: String,
  },
  likeCount: {
    type: Number,
  },
  team: {
    type: String
  },
  createdAt: {
    type: Date,
  },
});


const Like: Model<ILike> = models.Like || model<ILike>("Like", LikeSchema);

export default Like;
