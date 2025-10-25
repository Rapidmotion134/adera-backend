import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await user.comparePassword(password)) && user.isActive) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = {
      email: user.email,
      sub: user.firstName,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      userId: user.id,
      registered: user.address !== null && user.phone !== null,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWTKEY,
    });
    return {
      access_token: token,
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string; userId: number }> {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (!user) {
      const newUser = await this.userService.create(createUserDto);
      return {
        access_token: (await this.login(newUser)).access_token,
        userId: newUser.id,
      };
    } else {
      return null;
    }
  }
}
