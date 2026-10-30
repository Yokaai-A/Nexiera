export function validateEnvironment(environment: Record<string, unknown>) {
  if (String(environment.NODE_ENV) === "production" && String(environment.EMAIL_VERIFICATION_DEV_LINKS) === "true") {
    throw new Error("EMAIL_VERIFICATION_DEV_LINKS must be disabled in production.");
  }

  const jwtSecret = String(environment.JWT_SECRET || "");
  if (jwtSecret.length < 64 || new Set(jwtSecret).size < 16) {
    throw new Error("JWT_SECRET must be a high-entropy random value of at least 64 characters.");
  }

  const frontendUrl = String(environment.FRONTEND_URL || "");
  let frontend: URL;
  try {
    frontend = new URL(frontendUrl);
  } catch {
    throw new Error("FRONTEND_URL must be one exact frontend origin.");
  }
  if (frontendUrl === "*" || frontend.username || frontend.password || frontend.pathname !== "/" || frontend.search || frontend.hash) {
    throw new Error("FRONTEND_URL must contain only one exact origin, without a path, credentials, query, or wildcard.");
  }
  if (String(environment.NODE_ENV) === "production" && frontend.protocol !== "https:") {
    throw new Error("FRONTEND_URL must use HTTPS in production.");
  }

  return environment;
}
