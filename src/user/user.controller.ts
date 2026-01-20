import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CompleteSignupDto, UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.createAdmin(createUserDto);
  }

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.Admin)
  @Get('admins')
  async findAllAdmins(@Req() req: Request) {
    if (req['user'].isSuperAdmin) {
      return this.userService.findAllAdmins();
    }
    return new UnauthorizedException();
  }

  @Roles(Role.Admin)
  @Get('count')
  userCount() {
    return this.userService.userCount();
  }

  @Roles(Role.User)
  @Patch('completesignup/:id')
  completeSignup(
    @Param('id') id: string,
    @Body() completeSignupDto: CompleteSignupDto,
  ) {
    return this.userService.completeSignup(+id, completeSignupDto);
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    if (req['user'].userId === +id || req['user'].isAdmin) {
      return this.userService.findOne(+id);
    }
    return new UnauthorizedException();
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.User)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    if (req.user.userId === +id || req.user.isAdmin) {
      return this.userService.update(+id, updateUserDto);
    }
    return new UnauthorizedException();
  }

  @Roles(Role.Admin)
  @Patch('active/:id')
  updateActivation(@Param('id') id: string) {
    return this.userService.activationStatus(+id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
