"use server";

import { fetcher, postFetcher } from '@/api-actions/api';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null;
  bio: string;
  avatar: string;
  socials: {
    facebook: string;
    twitter: string;
    linkedIn: string;
  };
  verificationDocuments: {
    idCard: {
      url: string;
      verified: boolean;
    };
    drivingLicense: {
      url: string;
      verified: boolean;
    };
  };
  rating?: {
    average: number;
    count: number;
  };
}

export async function getProfile(): Promise<ProfileData> {
  try {
    console.log('🔍 Server Action: Fetching profile...');
    const result = await fetcher<ProfileData>('users/profile');
    console.log('Server Action: Profile fetched successfully', result);
    return result;
  } catch (error: any) {
    console.error('Server Action Error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(error?.message || 'Failed to fetch profile');
  }
}

export async function updateProfile(data: {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  bio: string;
  avatar: string;
  socials: {
    facebook: string;
    twitter: string;
    linkedIn: string;
  };
  verificationDocuments: {
    idCard: { url: string; verified: boolean };
    drivingLicense: { url: string; verified: boolean };
  };
}): Promise<ProfileData> {
  try {
    console.log('💾 Server Action: Updating profile...', data);
    const result = await postFetcher<typeof data, ProfileData>('users/profile', data);
    console.log('✅ Server Action: Profile updated successfully', result);
    return result;
  } catch (error: any) {
    console.error('❌ Server Action Update Error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(error?.message || 'Failed to update profile');
  }
}
