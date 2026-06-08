import mongoose, { Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  booking: Types.ObjectId;

  sender: "user" | "driver";

  text: string;

  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new mongoose.Schema<IChatMessage>(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    sender: {
      type: String,
      enum: ["user", "driver"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessage =
  mongoose.models.ChatMessage ||
  mongoose.model<IChatMessage>("ChatMessage", chatMessageSchema);

export default ChatMessage;