import { AcademicCourse, UserProfile } from "@/src/types/course";
import { INITIAL_COURSES, INITIAL_USER } from "./mockData";

const STORAGE_KEYS = {
  COURSES: "nexiera_academic_courses_v2",
  USER: "nexiera_current_user",
  REGISTERED: "nexiera_registered_courses",
};

function dispatchCustomEvent(name: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(name));
  }
}

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
      if (!parsed[0].mainCategory) {
        localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
        return INITIAL_COURSES;
      }
      return parsed;
    }
    return INITIAL_COURSES;
  } catch (error) {
    console.error("Error reading courses from storage:", error);
    return INITIAL_COURSES;
  }
}

export function saveNewCourse(course: Omit<AcademicCourse, "id" | "createdAt">): AcademicCourse {
  const currentCourses = getStoredCourses();
  const newCourse: AcademicCourse = {
    ...course,
    id: `course-${Date.now()}`,
    createdAt: new Date().toISOString(),
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

export function getCourseById(id: string): AcademicCourse | undefined {
  const courses = getStoredCourses();
  return courses.find((c) => c.id === id);
}

export function getRegisteredCourseIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading registered courses:", error);
    return [];
  }
}

export function isCourseRegistered(courseId: string): boolean {
  const list = getRegisteredCourseIds();
  return list.includes(courseId);
}

export function registerCourse(courseId: string): void {
  const current = getRegisteredCourseIds();
  if (!current.includes(courseId)) {
    const updated = [courseId, ...current];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.REGISTERED, JSON.stringify(updated));
        dispatchCustomEvent("nexiera_registration_update");
      } catch (error) {
        console.error("Error saving registered course:", error);
      }
    }
  }
}

export function getRegisteredCourses(): AcademicCourse[] {
  const ids = getRegisteredCourseIds();
  const allCourses = getStoredCourses();
  return allCourses.filter((course) => ids.includes(course.id));
}

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

export function logoutUser(): void {
  const user = getStoredUser();
  saveStoredUser({ ...user, isLoggedIn: false });
}

export function loginUser(email?: string, fullName?: string): UserProfile {
  const user = getStoredUser();
  return saveStoredUser({
    ...user,
    email: email || user.email,
    fullName: fullName || user.fullName,
    isLoggedIn: true,
  });
}
