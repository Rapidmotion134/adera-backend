// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  constructor() {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      storage: multer.diskStorage({
        destination: process.env.MULTER_UPLOAD_DIR || 'uploads/',
        filename: (_req, file, cb) => {
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
      return {
        message: 'File uploaded successfully',
        name: file.filename,
      };
    } catch (error) {
      console.error('Upload error:', error);

      throw new HttpException(
        'File upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = `uploads/${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return res.download(filePath, filename);
  }
}
