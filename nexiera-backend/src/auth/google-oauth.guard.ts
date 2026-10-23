import {
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleOAuthGuard extends AuthGuard("google") {
  constructor(private readonly config: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const clientId = this.config.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = this.config.get<string>("GOOGLE_CLIENT_SECRET");
    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException("Google Sign-In is not configured on this server");
    }
    return super.canActivate(context);
  }
}
