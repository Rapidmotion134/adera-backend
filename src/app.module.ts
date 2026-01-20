import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
import { DocumentModule } from './document/document.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { PageModule } from './page/page.module';
import { UploadController } from './upload/upload.controller';
import { NotificationModule } from './notification/notification.module';
import { MilestoneModule } from './milestone/milestone.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      // host: 'localhost',
      // port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { ca: readFileSync(process.env.DB_CERT_CA).toString() }
          : { rejectUnauthorized: false },
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    DocumentModule,
    AuthModule,
    NotificationModule,
    PaymentModule,
    PageModule,
    MilestoneModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
