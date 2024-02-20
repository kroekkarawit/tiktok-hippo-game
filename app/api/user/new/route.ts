import { connectToDB } from "@/utils/database";
import { Document } from "mongoose"; // Import Document from mongoose
import User from "@/models/user";

interface IUser extends Document {
  userIdTiktok: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  createdAt: Date;
}

export const POST = async (request: Request): Promise<Response> => {
  try {
    const { userIdTiktok, uniqueId, nickname, profilePictureUrl } =
    await request.json();

    await connectToDB();

    const checkUser : IUser | null = await User.findOne({userIdTiktok : userIdTiktok});
    if(checkUser){
        return new Response("UserId is existing", { status: 500 });
    }

    const newUser: IUser = new User({
      userIdTiktok: userIdTiktok,
      uniqueId: uniqueId,
      nickname: nickname,
      profilePictureUrl: profilePictureUrl,
      createdAt: new Date(),
    });

    await newUser.save();
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new user", { status: 500 });
  }
};
