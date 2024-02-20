import { connectToDB } from "@/utils/database";
import { Document } from "mongoose"; // Import Document from mongoose
import Comment from "@/models/comment";
import User from "@/models/user";
interface IComment extends Document {
  userId: object;
  comment: string;
  userIdTiktok: string;
  uniqueId: string;
  createdAt: Date;
}

interface IUser extends Document {
  userIdTiktok: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  team: string | null;
  createdAt: Date;
}

export const POST = async (request: Request): Promise<Response> => {
  try {
    const { comment, userIdTiktok, uniqueId, nickname, profilePictureUrl } =
      await request.json();

    await connectToDB();

    let checkUser: IUser | null = await User.findOne({
      userIdTiktok: userIdTiktok,
    });
    if (!checkUser) {
      const newUser: IUser = new User({
        userIdTiktok: userIdTiktok,
        uniqueId: uniqueId,
        nickname: nickname,
        profilePictureUrl: profilePictureUrl,
        createdAt: new Date(),
      });
      await newUser.save();
      checkUser = newUser;
    }
    
    const newTeam = ["B", "R"].includes(comment.toLocaleUpperCase()) ? comment.toLocaleUpperCase() : null;
    if (!newTeam) {
      return new Response("Failed to create a new comment", { status: 500 });
    }
   

    const updateResult = await User.updateOne(
      { userIdTiktok }, // Find the user by userIdTiktok
      { $set: { team: newTeam } } // Update the team field
    );
 
    const newComment: IComment = new Comment({
      userId: checkUser._id,
      comment: comment,
      userIdTiktok: userIdTiktok,
      uniqueId: uniqueId,
      createdAt: new Date(),
    });

    await newComment.save();
    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new comment", { status: 500 });
  }
};
