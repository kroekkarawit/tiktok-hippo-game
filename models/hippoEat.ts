import { Schema, model, models, Document, Model } from "mongoose";

interface IHippoEat extends Document {
  userId: Schema.Types.ObjectId;
  profilePictureUrl: string;
  score: number;
  userIdTiktok: string;
  uniqueId: string;
  createdAt: Date;
}

const HippoEatSchema: Schema<IHippoEat> = new Schema({
  userId: {
    type: String,
  },
  profilePictureUrl: {
    type: String
  },
  score: {
    type: Number
  },
  userIdTiktok: {
    type: String,
  },
  uniqueId: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

const HippoEat: Model<IHippoEat> = models.HippoEat || model<IHippoEat>("HippoEat", HippoEatSchema);

export default HippoEat;