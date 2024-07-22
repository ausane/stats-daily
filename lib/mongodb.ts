import mongoose from "mongoose";

const connectToDatabase = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env.local"
        );
    }

    if (mongoose.connections[0].readyState) return;

    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectToDatabase;
