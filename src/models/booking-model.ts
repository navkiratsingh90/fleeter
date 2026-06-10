import mongoose, { Document, Types } from "mongoose";

export type PaymentStatus =
  | "pending"
  | "cash"
  | "failed"
  | "paid";

export type BookingStatus =
  | "idle"
  | "requested"
  | "awaiting_payment"
  | "confirmed"
  | "started"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

export interface IBooking extends Document {
  user: Types.ObjectId;
  driver: Types.ObjectId;
  vehicle: Types.ObjectId;

  pickUpAddress: string;
  dropAddress: string;

  pickupLocation: {
    type: "Point";
    coordinates: [number, number];
  };

  dropLocation: {
    type: "Point";
    coordinates: [number, number];
  };

  fare: number;

  driverMobileNumber: string;
  userMobileNumber: string;

  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentDeadline : Date
  adminCommission: number;
  partnerAmount: number;

  pickupOtp: string;
  dropOtp: string;
  distanceCovered? : number,
  duration? : number,
  pickupOtpExpiresAt?: Date;
  dropOtpExpiresAt?: Date;
  createdAt : Date,
  updatedAt : Date
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    pickUpAddress: {
      type: String,
      required: true,
      trim: true,
    },

    dropAddress: {
      type: String,
      required: true,
      trim: true,
    },

    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    dropLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    driverMobileNumber: {
      type: String,
      required: true,
    },

    userMobileNumber: {
      type: String,
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: [
        "idle",
        "requested",
        "awaiting_payment",
        "confirmed",
        "started",
        "completed",
        "cancelled",
        "rejected",
        "expired",
      ],
      default: "requested",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "cash", "failed", "paid"],
      default: "pending",
    },
    paymentDeadline: {
      type : Date,
    },
    adminCommission: {
      type: Number,
      default: 0,
    },

    partnerAmount: {
      type: Number,
      default: 0,
    },

    // OTP will be generated later
    pickupOtp: {
      type: String,
      default: "",
    },

    dropOtp: {
      type: String,
      default: "",
    },
    distanceCovered : {
      type : Number,
      default : 0
    },
    duration : {
      type : Number,
      default : 0
    },
    pickupOtpExpiresAt: Date,
    dropOtpExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);


const Booking =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;