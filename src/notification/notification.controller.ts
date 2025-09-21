import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/role.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Roles(Role.User)
  @Get('user/:userId')
  findAllFor(@Param('userId') userId: string, @Req() req) {
    if (req.user.userId === +userId) {
      return this.notificationService.findAllForUser(+userId);
    } else {
      return new UnauthorizedException();
    }
  }

  @Roles(Role.User)
  @Get('user/unread/:userId')
  findAllUnreadFor(@Param('userId') userId: string, @Req() req) {
    if (req.user.userId === +userId) {
      return this.notificationService.findAllUnreadForUser(+userId);
    } else {
      return new UnauthorizedException();
    }
  }

  @Roles(Role.User)
  @Patch(':id')
  update(@Param('id') id: string, @Req() req) {
    return this.notificationService.update(+id, req.user);
  }

  @Roles(Role.User)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
