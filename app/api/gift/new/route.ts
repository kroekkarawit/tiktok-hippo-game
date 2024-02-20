import { connectToDB } from "@/utils/database";
import { Document } from "mongoose"; // Import Document from mongoose
import Gift from "@/models/gift";
import User from "@/models/user";
interface IGift extends Document {
  userId: object;
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
      userIdTiktok,
      uniqueId,
      giftId,
      repeatCount,
      giftType,
      giftName,
      giftPictureUrl,
      nickname,
      profilePictureUrl,
    } = await request.json();

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

    const newGift: IGift = new Gift({
      userId: checkUser._id,
      userIdTiktok: userIdTiktok,
      uniqueId: uniqueId,
      giftId: giftId,
      repeatCount: repeatCount,
      giftType: giftType,
      giftName: giftName,
      giftPictureUrl: giftPictureUrl,
      team: checkUser.team,
      createdAt: new Date(),
    });

    await newGift.save();
    return new Response(JSON.stringify(newGift), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new comment", { status: 500 });
  }
};
