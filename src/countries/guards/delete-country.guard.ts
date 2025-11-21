import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class DeleteCountryGuard implements CanActivate {

  private readonly requiredToken = 'parcial_1_token';

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();

    const token = req.headers['x-auth-token'];

    if (!token) {
      throw new UnauthorizedException('Missing x-auth-token header');
    }

    if (token !== this.requiredToken) {
      throw new ForbiddenException('Invalid token');
    }

    return true;
  }
}
