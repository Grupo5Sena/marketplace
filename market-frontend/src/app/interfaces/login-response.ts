import { UserProfile } from "./user-profile";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile
}
