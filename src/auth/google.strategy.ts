import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptions,
} from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

interface GoogleStrategyOptions extends StrategyOptions {
  accessType?: 'offline';
  prompt?: 'consent' | 'select_account';
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/redirect', // <-- Your NestJS Redirect URL
      scope: ['email', 'profile'],
      accessType: 'offline',
      prompt: 'consent',
    } as GoogleStrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken,
      refreshToken,
    };

    const existingUser = await this.userService.findByEmail(emails[0].value);
    if (!existingUser) {
      const newUser = await this.userService.create({
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        password: Math.random().toString(36).slice(-8),
        phone: '',
        address: '',
      });
      await this.userService.create(newUser);
    } else {
      this.authService.login(existingUser);
    }

    done(null, existingUser || user);
  }
}
