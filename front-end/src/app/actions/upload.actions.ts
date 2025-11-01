"use server";

import { postFetcher } from '@/api-actions/api';

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function uploadFile(file: File): Promise<string> {
  // Validate file size on client side
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the maximum limit of 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file');
    }

    const result = await response.json();
    return result.data.url;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(error?.message || 'Failed to upload file');
  }
}
