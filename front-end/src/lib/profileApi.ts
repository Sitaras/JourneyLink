import { getUserProfile } from "@/api-actions/user";

export async function getProfile() {

  try {
    const response = await getUserProfile();

    return { data: response };
  } catch {
    return { data: null, error: "Failed to user profile" };
  }
}
