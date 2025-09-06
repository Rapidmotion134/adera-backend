import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from './entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Request } from 'src/requests/entities/request.entity';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Notification]),
    TypeOrmModule.forFeature([Request]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService, S3Service],
})
export class DocumentModule {}
