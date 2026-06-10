import mongoose, { Document } from "mongoose";

type videoKycStatus = "pending" | "approved" | "rejected" | "not_required" | "in_progress"
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "partner";
  otp : string | null,
  partnerOnboardingSteps : number,
  isEmailVerified : boolean,
  mobileNumber? : string,
  partnerStatus : "pending" | "approved" | "rejected",
  rejectionReason? : string,
  videoKycStatus : videoKycStatus,
  videoKycRoomId? : string,
  videoKycRejectionReason? : string,
  otpExpiresAt? : Date ,
  socketId : string | null,
  location?: {
    type : "Point",
    coordinates : [number,number]
  },
  isOnline : boolean,
  createdAt : Date,
  updatedAt : Date
  rating : number
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber : {
      type : String, 
    },
    partnerStatus : {
      type : String,
      enum : ["pending", "approved" , "rejected"],
      default : "pending"
    },
    role: {
      type: String,
      enum: ["user", "admin", "partner"],
      default: "user", 
    },
    rejectionReason : {
      type : String
    },
    videoKycStatus : {
      type : String,
      enum : ["pending" , "approved" , "rejected" , "not_required" ,"in_progress"],
      default : "not_required"
    },
    videoKycRoomId : {
      type : String
    },
    videoKycRejectionReason : {
      type : String
    },
    isEmailVerified: {
      type : Boolean,
      default : false
    },
    partnerOnboardingSteps : {
      type : Number,
      min : 0,
      max : 8,
      default : 0
    },
    otpExpiresAt : {
      type : Date,
    },
    otp : {
      type : String,
      default : null
    },
    socketId : {
      type : String,
      default : null
    },
    location : {
      type : {
        type : String,
        enum : ["Point"]
      },
      coordinates :  [Number], 
    },
    isOnline : {
      type :Boolean,
      default : false,
      index : true
    },
    rating : {
      type : Number,
      enum : [1,2,3,4,5]
    }
  },
  { timestamps: true }
);
userSchema.index({location : "2dsphere"})
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;