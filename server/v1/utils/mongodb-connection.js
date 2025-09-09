import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri, { dbName: "dalia-catalog" });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log('Error connecting to MongoDB:', err.message);
        process.exit(1); // Finaliza o processo em caso de erro
    }
};

export default connectDB;