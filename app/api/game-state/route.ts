import { connectToDB } from "@/utils/database";
import Like from "@/models/like";
import Comment from "@/models/comment";

import { Document } from "mongoose";
import User from "@/models/user";

interface IComment extends Document {
  userId: object;
  comment: string;
  userIdTiktok: string;
  uniqueId: string;
  createdAt: Date;
}
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

export const GET = async (): Promise<Response> => {
  try {
    await connectToDB();
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const fourMinutesAgo = new Date(Date.now() - 4 * 60 * 1000);
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    let getLike: Array<ILike> = await Like.find({
      team: { $ne: null }, createdAt: { $gte: twoMinutesAgo }
    });

    const TotalBlueLike: number = getLike.reduce(
      (sum: number, item: ILike) =>
        item.team === "B" ? sum + item.likeCount : sum,
      0
    );
    const TotalRedLike: number = getLike.reduce(
      (sum: number, item: ILike) =>
        item.team === "R" ? sum + item.likeCount : sum,
      0
    );
    /*
    const blue: number = Math.round(
      (TotalBlueLike / (TotalBlueLike + TotalRedLike)) * 100
    );
    const red: number = Math.round(
      (TotalRedLike / (TotalBlueLike + TotalRedLike)) * 100
    );
    */
    const blue: number = (TotalBlueLike / (TotalBlueLike + TotalRedLike)) * 100;
    const red: number = (TotalRedLike / (TotalBlueLike + TotalRedLike)) * 100;
    const blueUserId: string[] = getLike
      .filter((item: ILike) => item.team === "B")
      .map((item: ILike) => {
        return item.userIdTiktok;
      });
     /* 
    const getBlueUserImage: any = await User.find({
      userIdTiktok: { $in: blueUserId },
    });
    */
    const getBlueUserImage: any = await User.find({
      //team: "B",
    }).limit(50);
    const blueUserImage: string[] = getBlueUserImage.map((item: IUser) => {
      return item.profilePictureUrl;
    });


    const redUserId: string[] = getLike
      .filter((item: ILike) => item.team === "R")
      .map((item: ILike) => {
        return item.userIdTiktok;
      });
      /*
    const getRedUserImage: any = await User.find({
      userIdTiktok: { $in: redUserId },
    });

    */
    const getRedUserImage: any = await User.find({
      team: "R",
    });
    const redUserImage: string[] = getRedUserImage.map((item: IUser) => {
      return item.profilePictureUrl;
    });
    const areaDefault : number = !blue && !red ? 50 : 0;
    const gameConfig = {
      blueHippoEatSpeed: 15,
      redHippoEatSpeed: 25,
      ballSpeed: 5,
      ballSize: 70,
    }
    return new Response(
      JSON.stringify({
        area: { blue: blue || areaDefault, red: red || areaDefault },
        users: { blue: blueUserImage, red: redUserImage },
        gameConfig: gameConfig
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to fetch comment likes", { status: 500 });
  }
};
