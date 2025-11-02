export type ProfileResponse = {
  avatar?: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
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
};
