import mongoose, { Document, Types } from "mongoose";

export interface IPartnerBank extends Document {
  owner: Types.ObjectId;

  accountHolder: string;

  accountNumber: string;

  ifsc: string;

  upi?: string;

  status:
    | "not_added"
    | "added"
    | "verified";

  rejectionReason?: string;

  createdAt: Date;

  updatedAt: Date;
}

const partnerBankSchema =
  new mongoose.Schema<IPartnerBank>(
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      accountHolder: {
        type: String,
        required: true,
        trim: true,
      },

      accountNumber: {
        type: String,
        required: true,
        trim: true,
      },

      ifsc: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },

      upi: {
        type: String,
        default: "",
        trim: true,
      },

      status: {
        type: String,
        enum: ["not_added", "added", "verified"],
        default: "not_added",
      },

      rejectionReason: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

const PartnerBank =
  mongoose.models.PartnerBank ||
  mongoose.model<IPartnerBank>(
    "PartnerBank",
    partnerBankSchema
  );

export default PartnerBank;