import { Schema, Document, model, Types } from "mongoose";

// Mongoose Document interface for Profile
interface IProfile extends Document {
  user: Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  avatar?: string;
  bio?: string;
  socials?: {
    facebook?: string;
    twitter?: string;
    linkedIn?: string;
  };
  verificationDocuments?: {
    idCard?: {
      url: string;
      verified: boolean;
    };
    drivingLicense?: {
      url: string;
      verified: boolean;
    };
  };
  rating?: {
    average: number;
    count: number;
  };
}

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
