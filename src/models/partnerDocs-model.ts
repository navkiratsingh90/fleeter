import mongoose, { Document, Types } from "mongoose";

export interface IPartnerDocs extends Document {
  owner: Types.ObjectId;

  aadharUrl: string;

  rcUrl: string;

  licenseUrl: string;

  status:
    | "pending"
    | "approved"
    | "rejected";

  rejectionReason?: string;

  createdAt: Date;

  updatedAt: Date;
}

const partnerDocsSchema =
  new mongoose.Schema<IPartnerDocs>(
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      aadharUrl: {
        type: String,
        required: true,
      },

      rcUrl: {
        type: String,
        required: true,
      },

      licenseUrl: {
        type: String,
        required: true,
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
    },
    {
      timestamps: true,
    }
  );

const PartnerDocs =
  mongoose.models.PartnerDocs ||
  mongoose.model<IPartnerDocs>(
    "PartnerDocs",
    partnerDocsSchema
  );

export default PartnerDocs;