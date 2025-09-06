import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    let document = this.documentRepo.create(createDocumentDto);
    const user = await this.userRepo.findOneBy({
      id: createDocumentDto.userId,
    });
    document.user = user;
    await this.userRepo.save(user);
    // const notification = new Notification();
    // notification.date = new Date();
    // notification.description = `${document.title} is ready.`;
    // notification.title = 'New Document Received';
    // notification.user = user;
    document = await this.documentRepo.save(document);
    // notification.item = document.id;
    // this.notificationRepo.save(notification);
    return document;
  }

  // async fulfillRequest(createDocumentDto: CreateDocumentDto) {
  //   let document = this.documentRepo.create(createDocumentDto);
  //   const request = await this.requestRepo.findOne({
  //     where: { id: createDocumentDto.requestId },
  //     relations: { user: true },
  //   });
  //   if (request.isDone) {
  //     return request.document;
  //   }
  //   const users = await this.userRepo.find({
  //     where: { isAdmin: true },
  //   });
  //   document.isRequested = true;
  //   document.user = request.user;
  //   document = await this.documentRepo.save(document);
  //   request.document = document;
  //   request.isDone = true;
  //   await this.requestRepo.save(request);
  //   users.forEach((user) => {
  //     const notification = new Notification();
  //     notification.item = document.id;
  //     notification.title = 'New Document Received';
  //     notification.description = `${document.title} for ${request.subject} is ready.`;
  //     notification.user = user;
  //     this.notificationRepo.save(notification);
  //   });
  //   return document;
  // }

  async findAll() {
    return await this.documentRepo.find({
      relations: { user: true },
    });
  }

  async expiringCount() {
    return await this.documentRepo.countBy({ isExpiring: true });
  }

  async findAllByUser(userId: number) {
    return await this.documentRepo.find({
      relations: { user: true },
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, user: any) {
    const document = await this.documentRepo.findOne({
      relations: { /*request: true,*/ user: true },
      where: { id },
      cache: false, // Disable cache for the query
    });
    if (user.userId === document.user.id || user.isAdmin) {
      return document;
    }
    return new UnauthorizedException();
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const existingDocument = await this.documentRepo.findOneBy({ id });
    Object.assign(existingDocument, updateDocumentDto);
    return this.documentRepo.save(existingDocument);
  }

  async updateStatus(id: number, user: any) {
    const existingDocument = await this.documentRepo.findOne({
      relations: { user: true },
      where: { id },
    });
    if (user.userId === existingDocument.user.id) {
      existingDocument.isRead = true;
      return this.documentRepo.save(existingDocument);
    } else if (user.isAdmin && existingDocument.isRequested) {
      existingDocument.isRead = true;
      return this.documentRepo.save(existingDocument);
    }
    return new UnauthorizedException();
  }

  remove(id: number) {
    return this.documentRepo.softDelete({ id });
  }
}
