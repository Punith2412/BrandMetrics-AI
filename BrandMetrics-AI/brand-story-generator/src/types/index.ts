export interface Question {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}

export type ContentType = "full_profile" | "social_ads" | "pitch_deck";

export interface UserAnswers {
  name: string;
  profession: string;
  background: string;
  strengths: string;
  uniqueValue: string;
  goals: string;
  audience: string;
  tonePreference: string;
  contentType?: ContentType;
}

export type StoryVersion = "professional" | "friendly" | "bold";

export interface PlatformAd {
  platform: "linkedin" | "instagram" | "facebook" | "x";
  hook: string;
  body: string;
  cta: string;
  hashtags?: string[];
}

export interface PitchSlide {
  title: string;
  coreMessage: string;
  visualCue: string;
}

export interface GeneratedContent {
  id: string;
  createdAt: string;
  answers: UserAnswers;
  // Profile section
  stories: {
    professional: string;
    friendly: string;
    bold: string;
  };
  linkedinHeadline: string;
  linkedinBio: string;
  contentIdeas: string[];
  // Social Ads section
  ads: PlatformAd[];
  // Pitch Deck section
  elevatorPitch: string;
  pitchSlides: PitchSlide[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: "email" | "google";
}
