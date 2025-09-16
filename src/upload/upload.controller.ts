// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import * as multer from 'multer';
import * as fs from 'fs';
import * as util from 'util';

const unlink = util.promisify(fs.unlink);

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      storage: multer.diskStorage({
        destination: process.env.MULTER_UPLOAD_DIR || 'uploads/',
        filename: (req, file, cb) => {
          const uniquePrefix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const sanitizedFileName = file.originalname.replace(
            /[^a-zA-Z0-9-_.]/g,
            '',
          );
          cb(null, `${uniquePrefix}-${sanitizedFileName}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const s3Uri = await this.s3Service.uploadFile(
        file.path,
        process.env.FILE_BUCKET,
        `uploads/${file.filename}`,
      );

      // Delete the file from local storage after successful S3 upload
      await unlink(file.path);

      return { message: 'File uploaded successfully', s3Uri };
    } catch (error) {
      console.error('Upload error:', error);

      // Attempt to delete the file even if upload failed
      if (file?.path) {
        try {
          await unlink(file.path);
        } catch (err) {
          console.error('Error deleting temporary file:', err);
        }
      }

      throw new HttpException(
        'File upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
