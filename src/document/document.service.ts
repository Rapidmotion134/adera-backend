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

  async create(createDocumentDto: CreateDocumentDto, userId: number) {
    let document = this.documentRepo.create(createDocumentDto);
    const user = await this.userRepo.findOneBy({
      id: userId,
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

  async createForRequest(createDocumentDto: CreateDocumentDto, userId) {
    let document = this.documentRepo.create(createDocumentDto);
    // const users = await this.userRepo.find({
    //   where: { isAdmin: true },
    // });
    const user = await this.userRepo.findOneBy({
      id: userId,
    });
    document.user = user;
    document.isRequested = true;
    document = await this.documentRepo.save(document);
    // users.forEach((user) => {
    //     const notification = new Notification();
    //     notification.item = document.id;
    //     notification.title = 'New Document Received';
    //     notification.description = `${document.title} for ${request.subject} is ready.`;
    //     notification.user = user;
    //     this.notificationRepo.save(notification);
    //   });
    return document;
  }

  async findAll() {
    return await this.documentRepo.find({
      relations: { user: true },
    });
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
    if (
      user.userId === existingDocument.user.id ||
      (user.isAdmin && existingDocument.isRequested)
    ) {
      existingDocument.isRead = true;
      return this.documentRepo.save(existingDocument);
    }
    return new UnauthorizedException();
  }

  remove(id: number) {
    return this.documentRepo.softDelete({ id });
  }
}
