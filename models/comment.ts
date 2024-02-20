import { Schema, model, models, Document, Model } from "mongoose";

interface IComment extends Document {
  userId: Schema.Types.ObjectId;
  comment: string;
  userIdTiktok: string;
  uniqueId: string;
  createdAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema({
  userId: {
    type: String,
  },
  userIdTiktok: {
    type: String,
  },
  uniqueId: {
    type: String,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

const Comment: Model<IComment> = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;