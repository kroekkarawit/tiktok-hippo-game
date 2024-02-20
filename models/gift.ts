import { Schema, model, models, Document, Model } from "mongoose";

interface IGift extends Document {
  userId: Schema.Types.ObjectId;
  userIdTiktok: string;
  uniqueId: string;
  giftId: string;
  repeatCount: number;
  giftType: number;
  giftName: string;
  giftPictureUrl: string;
  team: string;
  createdAt: Date;
}

const GiftSchema: Schema<IGift> = new Schema({
  userId: {
    type: String,
  },
  userIdTiktok: {
    type: String,
  },
  uniqueId: {
    type: String,
  },
  giftId: {
    type: String,
  },
  repeatCount: {
    type: Number,
  },
  giftType: {
    type: Number,
  },
  giftName: {
    type: String,
  },
  giftPictureUrl: {
    type: String,
  },
  team: {
    type: String
  },
  createdAt: {
    type: Date,
  },
});

const Gift: Model<IGift> = models.Gift || model<IGift>("Gift", GiftSchema);

export default Gift;

