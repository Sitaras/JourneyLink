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
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    socials: {
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      linkedIn: {
        type: String,
        default: "",
      },
    },

    verificationDocuments: {
      idCard: {
        url: {
          type: String,
          default: "",
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
      drivingLicense: {
        url: {
          type: String,
          default: "",
        },
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
