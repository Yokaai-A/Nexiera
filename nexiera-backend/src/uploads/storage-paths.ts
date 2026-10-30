import { join, resolve } from "node:path";

export function getPublicUploadsDir() {
  return process.env.UPLOADS_DIR ? resolve(process.env.UPLOADS_DIR) : join(process.cwd(), "uploads");
}

export function getPrivateUploadsDir() {
  return process.env.PRIVATE_UPLOADS_DIR ? resolve(process.env.PRIVATE_UPLOADS_DIR) : join(process.cwd(), "private-uploads");
}
