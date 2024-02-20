import { connectToDB } from "@/utils/database";
import { Document } from "mongoose"; // Import Document from mongoose
import Like from "@/models/like";
import User from "@/models/user";

interface ILike extends Document {
  userId: object;
  likeCount: number;
  userIdTiktok: string;
  uniqueId: string;
  team: string;
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
    const { likeCount, userIdTiktok, uniqueId, nickname, profilePictureUrl } =
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

    const newLike: ILike = new Like({
      userId: checkUser._id,
      likeCount: likeCount,
      userIdTiktok: userIdTiktok,
      uniqueId: uniqueId,
      team: checkUser.team,
      createdAt: new Date(),
    });

    await newLike.save();
    return new Response(JSON.stringify(newLike), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new Like", { status: 500 });
  }
};
