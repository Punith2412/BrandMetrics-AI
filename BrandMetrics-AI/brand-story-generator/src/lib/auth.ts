"use client";

import { User } from "@/types";

const USERS_KEY = "brandstory_users";
const SESSION_KEY = "brandstory_session";
const STORIES_KEY = "brandstory_stories";

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function loginWithEmail(email: string, password: string, name?: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    // Simple password check (in production use hashed passwords + backend)
    const storedPass = localStorage.getItem(`pass_${existing.id}`);
    if (storedPass !== password) {
      return { success: false, error: "Incorrect password" };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(existing));
    return { success: true, user: existing };
  }

  // Register new user
  if (!name) {
    return { success: false, error: "Name is required for new accounts" };
  }
  const user: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    provider: "email",
  };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(`pass_${user.id}`, password);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function loginWithGoogle(): { success: boolean; user?: User } {
  // Simulated Google login for demo (in production use NextAuth / Auth.js)
  const user: User = {
    id: `google_${Date.now()}`,
    email: "demo.user@gmail.com",
    name: "Demo Google User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    provider: "google",
  };
  const users = getUsers();
  if (!users.find((u) => u.email === user.email)) {
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true, user };
}

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

// Stories persistence
export function saveStory(userId: string, story: any) {
  const all = getAllStories();
  const userStories = all[userId] || [];
  userStories.unshift(story);
  all[userId] = userStories.slice(0, 50); // keep last 50
  localStorage.setItem(STORIES_KEY, JSON.stringify(all));
}

export function getUserStories(userId: string): any[] {
  const all = getAllStories();
  return all[userId] || [];
}

export function deleteStory(userId: string, storyId: string) {
  const all = getAllStories();
  all[userId] = (all[userId] || []).filter((s: any) => s.id !== storyId);
  localStorage.setItem(STORIES_KEY, JSON.stringify(all));
}

function getAllStories(): Record<string, any[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORIES_KEY) || "{}");
  } catch {
    return {};
  }
}
