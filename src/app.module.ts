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
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      // host: 'localhost',
      // port: 5432,
      // host: process.env.DB_HOST,
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_DATABASE,
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
    ProjectModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
