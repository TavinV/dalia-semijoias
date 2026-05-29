import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

clientSchema.index({ name: 1 });

const Client = mongoose.model("Client", clientSchema);

export default Client;
