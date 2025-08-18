import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Uploads')
@Controller('api/v1/uploads')
export class UploadsController {
  @Post('photos')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${crypto.randomUUID()}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    // Compute basic hash for MVP
    const data = fs.readFileSync(file.path);
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    // Store ReturnPhoto in DB as needed (omitted for brevity)
    return {
      url: `/uploads/${file.filename}`,
      hash,
      width: null,
      height: null,
    };
  }
}