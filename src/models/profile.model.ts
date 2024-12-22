import { Schema, Document, model } from "mongoose";
import { IProfile } from "../types/profile.types";

interface IProfileDocument extends IProfile, Document {}

const profileSchema = new Schema<IProfileDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    socials: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      linkedIn: {
        type: String,
      },
    },
    preferredLanguages: [
      {
        type: String,
      },
    ],
    verificationDocuments: {
      idCard: {
        url: String,
        verified: {
          type: Boolean,
          default: false,
        },
      },
      drivingLicense: {
        url: String,
        verified: {
          type: Boolean,
          default: false,
        },
      },
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = model<IProfile>("Profile", profileSchema);
