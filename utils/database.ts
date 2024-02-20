import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("Mongo is already connected!");
        return;
    }

    try {
        const mongodbUri = process.env.MONGODB_URI;
        if (!mongodbUri) {
            throw new Error("MONGODB_URI environment variable is not defined.");
        }

        await mongoose.connect(mongodbUri, {
            dbName: "tiktok_clicker",
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        isConnected = true;
        console.log("MongoDB is connected");
    } catch (error) {
        console.log(error);
    }
};
