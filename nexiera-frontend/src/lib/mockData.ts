import type { UserProfile } from "@/src/types/course";
export { CATEGORIES_DATA } from "./taxonomy";
export { INITIAL_COURSES } from "./universityCourses";
export const INITIAL_USER: UserProfile = {
  id: "user-binus-01",
  fullName: "Nicholas Aryan",
  email: "nicholas.aryan@binus.ac.id",
  campus: "BINUS University",
  major: "Teknik Informatika",
  isCampusVerified: true,
  isLoggedIn: true,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  semester: "Semester 4",
};
