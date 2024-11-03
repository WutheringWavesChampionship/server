import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'modules/auth';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: 'Not authorized',
      });
    }
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Not authorized',
      });
    }
    try {
      const verified = this.authService.verifyUser(token);
      const isAdmin = await this.authService.isAdmin(verified.id);
      const user = await this.authService.findById(verified.id);
      if (user && isAdmin) {
        req.user = user;
        return true;
      } else {
        throw new ForbiddenException();
      }
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid token',
      });
    }
  }
}
