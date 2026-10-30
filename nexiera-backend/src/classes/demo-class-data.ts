export function isDemoMode() {
  return process.env.DEMO_MODE === "true";
}

export function getDemoClassData(slugOrId: string) {
  const key = slugOrId.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "kelas";
  const classHash = Array.from(key).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const offset = classHash % 8 + 2;
  const demoSeats = 20 + (classHash % 11);
  const startsAt = new Date(Date.now() + offset * 24 * 60 * 60 * 1000);
  startsAt.setUTCHours(12, 0, 0, 0);
  const accessUntil = new Date(startsAt.getTime() + 45 * 24 * 60 * 60 * 1000);

  return {
    startsAt,
    accessUntil,
    accessDuration: "45 hari",
    meetingPlatform: "Jitsi Meet (Demo)",
    meetingLink: `https://meet.jit.si/nexiera-demo-${key}`,
    materialPlatform: "Web (Demo)",
    materialLink: "https://www.khanacademy.org/",
    maxQuota: demoSeats,
    availableSeats: demoSeats,
  };
}
