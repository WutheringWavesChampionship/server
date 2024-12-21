import {
  Controller,
  Get,
  Patch,
  Body,
  ParseIntPipe,
  Param,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WeaponService } from './weapon.service';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { CreateWeaponDTO, fileSchema } from 'swagger';
import { WeaponEntity } from 'modules/database';
import { AdminGuard } from '@guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ONE_MB_IN_BYTES } from '@shared/constants';

@ApiTags('Weapon')
@ApiBearerAuth()
@Controller()
export class WeaponController {
  constructor(private service: WeaponService) {}

  @ApiOperation({
    summary: 'Create weapon',
  })
  @ApiResponse({ status: 200, type: WeaponEntity })
  @UseGuards(AdminGuard)
  @ApiTags('Admins commands')
  @Post(API_ROUTES[API_ROUTES_ENUM.WEAPONS_LIST])
  create(
    @Body() data: CreateWeaponDTO,
    // @Req() { user }: { user: IUser },
  ) {
    return this.service.createWeapon(data);
  }

  @ApiOperation({
    summary: 'Get all weapons',
  })
  @ApiResponse({ status: 201, type: [WeaponEntity] })
  @Get(API_ROUTES[API_ROUTES_ENUM.WEAPONS_LIST])
  getAllCharacters() {
    return this.service.getAllWeapons();
  }

  @ApiOperation({
    summary: 'Get weapons',
  })
  @ApiResponse({ status: 200, type: WeaponEntity })
  @Get(API_ROUTES[API_ROUTES_ENUM.WEAPONS_CURRENT])
  getDetails(
    @Param('id', ParseIntPipe) id: number,
    // @Req() { user }: { user: IUser },
  ) {
    return this.service.getWeapon(id);
  }

  @ApiOperation({
    summary: 'Update weapon',
  })
  @ApiResponse({ status: 200, type: WeaponEntity })
  @UseGuards(AdminGuard)
  @ApiTags('Admins commands')
  @Patch(API_ROUTES[API_ROUTES_ENUM.WEAPONS_CURRENT])
  updateDetails(
    @Body() data: CreateWeaponDTO,
    @Param('id', ParseIntPipe) id: number,
    // @Req() { user }: { user: IUser },
  ) {
    return this.service.updateWeapon({ ...data, id });
  }

  @ApiOperation({
    summary: 'Delete weapon',
  })
  @ApiResponse({ status: 200, type: WeaponEntity })
  @ApiTags('Admins commands')
  @UseGuards(AdminGuard)
  @Delete(API_ROUTES[API_ROUTES_ENUM.WEAPONS_CURRENT])
  deleteWeapon(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteWeapon(id);
  }

  @ApiOperation({
    summary: 'Update character image',
  })
  @UseGuards(AdminGuard)
  @ApiTags('Admins commands')
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileSchema)
  @Post(API_ROUTES[API_ROUTES_ENUM.WEAPONS_CURRENT_IMAGE])
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 10 * ONE_MB_IN_BYTES },
    }),
  )
  uploadWeaponImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.updateWeaponImage({ data: file.buffer, id });
  }
}
