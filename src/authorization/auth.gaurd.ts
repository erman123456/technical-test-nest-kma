import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    let authIndex = 0;

    const request = context.switchToHttp().getRequest();
    await request.rawHeaders.forEach((res, index) => {
      if (res.toLowerCase() == 'authorization') {
        authIndex = index + 1;
      }
    });
    const token = request.rawHeaders[authIndex];
    if (!token) {
      throw new UnauthorizedException();
    }
    const validateToken = this.validateToken(token);
    if (!validateToken) {
      throw new UnauthorizedException();
    }
    return validateToken;
  }

  validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      return null;
    }
    const token = auth.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET;
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  }
}
