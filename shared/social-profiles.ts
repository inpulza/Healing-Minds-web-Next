import socialProfilesData from "./social-profiles.json";

export const socialProfiles = socialProfilesData;

export type SocialProfileKey = keyof typeof socialProfiles;

export const organizationSocialProfileUrls = [
  socialProfiles.facebook.url,
  socialProfiles.youtube.url,
] as const;

export const physicianSocialProfileUrls = [
  socialProfiles.linkedin.url,
  socialProfiles.instagram.url,
  socialProfiles.tiktok.url,
] as const;
