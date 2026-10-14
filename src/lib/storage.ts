// src/lib/storage.ts
import { AcademicCourse, UserProfile } from "@/src/types/course";
import { INITIAL_COURSES, INITIAL_USER } from "./mockData";

const STORAGE_KEYS = {
  COURSES: "nexiera_academic_courses",
  USER: "nexiera_current_user",
};

// Dispatch custom event for cross-component reactivity
function dispatchCustomEvent(name: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(name));
  }
}

/**
 * Get all courses, merging mock data with newly added courses from localStorage
 */
export function getStoredCourses(): AcademicCourse[] {
  if (typeof window === "undefined") {
    return INITIAL_COURSES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_COURSES;
  } catch (error) {
    console.error("Error reading courses from storage:", error);
    return INITIAL_COURSES;
  }
}

/**
 * Add a new course to localStorage
 */
export function saveNewCourse(course: Omit<AcademicCourse, "id" | "createdAt">): AcademicCourse {
  const currentCourses = getStoredCourses();
  const newCourse: AcademicCourse = {
    ...course,
    id: `course-${Date.now()}`,
    createdAt: new Date().toISOString(),
    rating: 5.0,
    reviewCount: 1,
  };

  const updatedCourses = [newCourse, ...currentCourses];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updatedCourses));
      dispatchCustomEvent("nexiera_course_update");
    } catch (error) {
      console.error("Error saving course to storage:", error);
    }
  }

  return newCourse;
}

/**
 * Get single course by ID
 */
export function getCourseById(id: string): AcademicCourse | undefined {
  const courses = getStoredCourses();
  return courses.find((c) => c.id === id);
}

/**
 * Get current user profile
 */
export function getStoredUser(): UserProfile {
  if (typeof window === "undefined") {
    return INITIAL_USER;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading user from storage:", error);
    return INITIAL_USER;
  }
}

/**
 * Update user profile or login status
 */
export function saveStoredUser(user: Partial<UserProfile>): UserProfile {
  const current = getStoredUser();
  const updated: UserProfile = { ...current, ...user };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      dispatchCustomEvent("nexiera_auth_update");
    } catch (error) {
      console.error("Error saving user to storage:", error);
    }
  }

  return updated;
}

/**
 * Logout current user
 */
export function logoutUser(): void {
  const user = getStoredUser();
  saveStoredUser({ ...user, isLoggedIn: false });
}

/**
 * Login user
 */
export function loginUser(email?: string, fullName?: string): UserProfile {
  const user = getStoredUser();
  return saveStoredUser({
    ...user,
    email: email || user.email,
    fullName: fullName || user.fullName,
    isLoggedIn: true,
  });
}
