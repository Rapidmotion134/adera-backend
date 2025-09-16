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
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Roles(Role.Admin)
  @Post('user/:userId')
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @Param('userId') userId: string,
  ) {
    return this.documentService.create(createDocumentDto, +userId);
  }

  @Roles(Role.User)
  @Post('requested')
  createForRequest(
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() req: Request,
  ) {
    return this.documentService.createForRequest(
      createDocumentDto,
      req['user'].userId,
    );
  }

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.documentService.findOne(+id, req['user']);
  }

  @Roles(Role.Admin, Role.User)
  @Get('user/:userId')
  findAllForUser(@Param('userId') userId: string, @Req() req: Request) {
    if (req['user'].userId === +userId || req['user'].isAdmin) {
      return this.documentService.findAllByUser(+userId);
    }
    return new UnauthorizedException();
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(+id, updateDocumentDto);
  }

  @Roles(Role.User)
  @Patch('update/status/:id')
  updateStatus(@Param('id') id: string, @Req() req: Request) {
    return this.documentService.updateStatus(+id, req['user']);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
