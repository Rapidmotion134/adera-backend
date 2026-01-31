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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from '../auth/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { UserService } from '../user/user.service';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ) {
    if (req['user'].isSuperAdmin) {
      return this.projectService.create(createProjectDto);
    } else {
      createProjectDto.admin = await this.userService.findOne(
        req['user'].userId,
      );
      return this.projectService.create(createProjectDto);
    }
  }

  @Roles(Role.Admin)
  @Get()
  findAll(@Req() req: Request) {
    if (req['user'].isSuperAdmin) {
      return this.projectService.findAll();
    } else {
      return new UnauthorizedException();
    }
  }

  @Roles(Role.Admin)
  @Get('admin')
  findForAdmin(@Req() req: Request) {
    return this.projectService.findForAdmin(+req['user'].userId);
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Roles(Role.Admin, Role.User)
  @Get('user/:userId')
  findForUser(@Param('userId') userId: string, @Req() req: Request) {
    if (req['user'].userId === +userId || req['user'].isAdmin) {
      return this.projectService.findForUser(+userId);
    }
    return new UnauthorizedException();
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
