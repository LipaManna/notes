import mongoose from "mongoose";

let isConnected = false;
const connectDB = async () => {
    if(isConnected){
        console.log("MongoDB is already connected");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
        isConnected = db.connections[0].readyState === 1;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;