import { Injectable } from "@nestjs/common";

@Injectable()
export class PresencesService {
  async markOwnPresence(classId: string, userId: string, status: string) {
    return { success: true, status, classId, userId };
  }
}
