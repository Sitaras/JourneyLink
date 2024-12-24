import { Types, Document } from "mongoose";

export interface IProfile extends Document {
  user: Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  avatar?: string;
  bio?: string;
  socials?: {
    facebook?: string;
    twitter?: string;
    linkedIn?: string;
  };
  preferredLanguages?: string[];
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
