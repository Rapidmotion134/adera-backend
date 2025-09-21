import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepo.create(createNotificationDto);
    return await this.notificationRepo.save(notification);
  }

  async findAllForUser(userId: number) {
    return await this.notificationRepo.find({
      where: {
        user: { id: userId },
      },
    });
  }

  async findAllUnreadForUser(userId: number) {
    return await this.notificationRepo.find({
      where: {
        isRead: false,
        user: { id: userId },
      },
    });
  }

  async findOne(id: number) {
    return await this.notificationRepo.findOne({
      where: { id: id },
      relations: { user: true },
    });
  }

  async update(id: number, user: any) {
    const notification = await this.findOne(id);
    if (user.userId === notification.user.id) {
      notification.isRead = true;
      return await this.notificationRepo.save(notification);
    } else {
      return new UnauthorizedException();
    }
  }

  remove(id: number) {
    return this.notificationRepo.delete({ id });
  }
}
