import {
  Controller,
  Get,
  Post,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { AdminGuard, AuthGuard } from '@guards/index';
import { FileInterceptor } from '@nestjs/platform-express';
import { ONE_MB_IN_BYTES } from '@shared/constants';
import { IUser } from '@shared/interface';
import { fileSchema, RegistrationDTO } from 'swagger';
import { UserEntity } from 'modules/database';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class UserController {
  constructor(private service: UserService) {}

  @ApiOperation({
    summary: 'Get me',
    description: 'get authorized user data',
  })
  @ApiResponse({ status: 200, type: UserEntity })
  @Get(API_ROUTES[API_ROUTES_ENUM.ME])
  create(@Req() { user }: { user: IUser }) {
    return user;
  }

  @ApiOperation({
    summary: 'Update my image',
    description: 'Update authorized user image',
  })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileSchema)
  @Post(API_ROUTES[API_ROUTES_ENUM.MY_IMAGE])
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 10 * ONE_MB_IN_BYTES },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() { user }: { user: IUser },
  ) {
    return this.service.updateUserImage({ data: file.buffer, id: user.id });
  }

  @ApiOperation({
    summary: 'Update me',
    description: 'update authorized user data',
  })
  @ApiResponse({ status: 200 })
  @Patch(API_ROUTES[API_ROUTES_ENUM.ME])
  updateMe(@Body() data: RegistrationDTO, @Req() { user }: { user: IUser }) {
    return this.service.updateUser({ id: user.id, ...data });
  }

  @ApiOperation({
    summary: 'Update user',
    description: 'update existed user data',
  })
  @ApiTags('Admins commands')
  @ApiResponse({ status: 201 })
  @Patch(API_ROUTES[API_ROUTES_ENUM.USER_CURRENT])
  @UseGuards(AdminGuard)
  updateUser(
    @Body() data: RegistrationDTO,
    @Param('id', ParseIntPipe) id: number,
    // @Req() { user }: { user: IUser },
  ) {
    return this.service.updateUser({ id: id, ...data });
  }

  @ApiOperation({
    summary: 'Update user image',
    description: 'Update existed user image',
  })
  @UseGuards(AdminGuard)
  @ApiTags('Admins commands')
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileSchema)
  @Post(API_ROUTES[API_ROUTES_ENUM.USER_CURRENT_IMAGE])
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 10 * ONE_MB_IN_BYTES },
    }),
  )
  uploadUserImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    // @Req() { user }: { user: IUser },
  ) {
    return this.service.updateUserImage({ data: file.buffer, id });
  }
}
