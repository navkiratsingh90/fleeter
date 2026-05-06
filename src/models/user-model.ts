import mongoose, { Document } from "mongoose";


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "vendor";
  otp : string | null,
  isEmailVerified : boolean,
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
    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user", 
    },
    isEmailVerified: {
      type : Boolean,
      default : false
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