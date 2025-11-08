// src/auth/jwt.strategy.ts (or similar path)

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// Import your types for the token payload
import { JwtPayload } from './jwt-payload.interface'; // You should define this interface

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    // You can inject your config service or a users service here
  ) {
    super({
      // 1. How to get the JWT from the request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      
      // 2. Ignore token expiration (set to false to enforce expiration)
      ignoreExpiration: false, 
      
      // 3. The secret key used to sign the token (MUST match the key in JwtModule.register)
      secretOrKey: 'YOUR_SECRET_KEY', // <-- **CRITICAL: REPLACE THIS!**
    });
  }

  // This method is called after the token is successfully validated by Passport
  async validate(payload: JwtPayload) {
    // You can fetch the user from the database here using payload.userId or payload.sub
    // For now, we'll just return the payload, which NestJS attaches to the request (req.user)
    return { userId: payload.sub, username: payload.username }; 
  }
}