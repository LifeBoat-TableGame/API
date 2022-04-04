import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class WsGuard implements CanActivate {
    constructor(private authService: AuthenticationService) {}

    
    private logger: Logger = new Logger('Guard');

    canActivate(
        context: ExecutionContext,
      ): boolean | Promise<boolean> | Observable<boolean> {
        const token = context.getArgByIndex(0).handshake.headers.authorization;
        return this.authService.validate(token)
    }
}