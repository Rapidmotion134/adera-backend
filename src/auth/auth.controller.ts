import {
  Controller,
  Post,
  Body,
  NotFoundException,
  HttpStatus,
  HttpCode,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req: Request) {
    // Passport will redirect to Google login
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req['user'] as any;
    const payload = await this.authService.login(user);
    const jwtToken = payload.access_token;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';
    if (user.id) {
      return res.redirect(`${FRONTEND_URL}/dashboard?token=${jwtToken}`);
    } else {
      return res.redirect(
        `${FRONTEND_URL}/dashboard?new=true&token=${jwtToken}`,
      );
    }
  }
}
