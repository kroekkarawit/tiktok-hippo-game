import { connectToDB } from "@/utils/database";
import { Document } from "mongoose"; // Import Document from mongoose
import HippoEat from "@/models/hippoEat";
import User from "@/models/user";
interface IHippoEat extends Document {
  userId: object;
  profilePictureUrl: string;
  score: number;
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
    const {
        profilePictureUrl,
        score,
    } = await request.json();

    await connectToDB();

    let checkUser: IUser | null = await User.findOne({
        profilePictureUrl: profilePictureUrl,
    });
    if (!checkUser) {
        return new Response("Failed to create a new score", { status: 500 });
    }

    const newHippoEat: IHippoEat = new HippoEat({
      userId: checkUser._id,
      userIdTiktok: checkUser.userIdTiktok,
      uniqueId: checkUser.uniqueId,
      profilePictureUrl:profilePictureUrl,
      score: score,
      createdAt: new Date(),
    });

    await newHippoEat.save();
    return new Response(JSON.stringify(newHippoEat), { status: 201 });
  } catch (error) {
    return new Response(`Failed to create a new new score ${error}`, { status: 500 });
  }
};
