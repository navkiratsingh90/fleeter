import mongoose, { Document, Types } from "mongoose";

export interface IVehicle extends Document {
  owner: Types.ObjectId;

  type:
    | "bike"
    | "car"
    | "auto"
    | "truck"
    | "van";

  vehicleModel: string;
  number: string;

  imageUrl: string;

  baseFare: number;

  pricePerKm: number;

  waitingCharge: number;

  status:
    | "pending"
    | "approved"
    | "rejected";

  rejectionReason?: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["bike", "car", "auto", "truck", "van"],
      required: true,
    },

    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    baseFare: {
      type: Number,
      required: true,
      min: 0,
    },

    pricePerKm: {
      type: Number,
      required: true,
      min: 0,
    },

    waitingCharge: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle =
  mongoose.models.Vehicle ||
  mongoose.model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;