import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { customAlphabet } from 'nanoid';
import * as crypto from 'crypto';
import * as path from 'path';

@Controller('api/v1/uploads')
export class UploadsController {
  constructor(private prisma: PrismaService) {}

  @Post('photos')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const id = customAlphabet('1234567890abcdef', 16)();
          cb(null, `${id}${ext}`);
        },
      }),
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const hash = crypto.createHash('sha256').update(file.buffer || file.path).digest('hex');
    const url = `/uploads/${file.filename}`;
    // Save ReturnPhoto in DB
    const photo = await this.prisma.returnPhoto.create({
      data: {
        url,
        hash,
        width: null,
        height: null,
      },
    });
    return res.json({
      id: photo.id,
      url: photo.url,
      hash: photo.hash,
      width: photo.width,
      height: photo.height,
    });
  }
}