import { connectToDB } from "@/utils/database";
import Like from "@/models/like";
import Comment from "@/models/comment";

import { Document } from "mongoose";
import User from "@/models/user";

import HippoEat from "@/models/hippoEat";

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

export const GET = async (): Promise<Response> => {
  try {
    await connectToDB();
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const fourMinutesAgo = new Date(Date.now() - 4 * 60 * 1000);
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    let getSumScore: Array<IHippoEat> = await HippoEat.aggregate([
      {
        $group: {
          _id: "$userIdTiktok",
          totalScore: { $sum: "$score" },
          profilePictureUrl: { $first: "$profilePictureUrl" },
          uniqueId: { $first: "$uniqueId" },
        },
      },
      {
        $sort: { totalScore: -1 },
      },
    ]);

    return new Response(
      JSON.stringify({
        getSumScore: getSumScore,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to fetch score", { status: 500 });
  }
};
