import mongoose, { Document } from "mongoose";


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "vendor";
  otp : string | null,
  partnerOnboardingSteps : number,
  isEmailVerified : boolean,
  mobileNumber : string,
  partnerStatus : "pending" | "approved" | "rejected",
  otpExpiresAt? : Date ,
  createdAt : Date,
  updatedAt : Date
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
      enum: ["user", "admin", "vendor"],
      default: "user", 
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
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;