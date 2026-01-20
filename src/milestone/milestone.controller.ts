import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { Roles } from '../auth/role.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestoneService.create(createMilestoneDto);
  }

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.milestoneService.findAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.milestoneService.findOne(+id);
  }

  @Roles(Role.Admin, Role.User)
  @Get('user/:userId')
  findForUser(@Param('userId') userId: string, @Req() req: Request) {
    if (req['user'].userId === +userId || req['user'].isAdmin) {
      return this.milestoneService.findForUser(+userId);
    }
    return new UnauthorizedException();
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.milestoneService.update(+id, updateMilestoneDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.milestoneService.remove(+id);
  }
}
