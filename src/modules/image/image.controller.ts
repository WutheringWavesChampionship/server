import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImageService } from './image.service';
import { Response } from 'express';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';

@ApiTags('Images')
@ApiBearerAuth()
@Controller()
export class ImageController {
  constructor(private service: ImageService) {}

  // @ApiOperation({
  //   summary: 'Delete image',
  //   description: 'Delete image',
  // })
  // @ApiTags('Admins commands')
  // @ApiResponse({ status: 200 })
  // @UseGuards(AdminGuard)
  // @Delete(API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT])
  // deleteImage(@Param('id', ParseIntPipe) id: number) {
  //   return this.service.deleteImage(id);
  // }

  @ApiOperation({
    summary: 'Get image',
    description: 'Get image',
  })
  @ApiTags('Images')
  @ApiResponse({ status: 200 })
  @Get(API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT])
  getCharacteristics(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'image/jpeg');
    return this.service.getImage({ id, res });
  }

  // @ApiOperation({
  //   summary: 'Update image',
  //   description: 'Update current image, authorized only',
  // })
  // @UseGuards(AuthGuard)
  // @ApiResponse({ status: 200 })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody(fileSchema)
  // @Patch(API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT])
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     limits: { files: 1, fileSize: 4 * ONE_MB_IN_BYTES },
  //   }),
  // )
  // uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.service.updateImage({
  //     data: file.buffer,
  //     id,
  //     basePath: 'wuwa',
  //   });
  // }
}
