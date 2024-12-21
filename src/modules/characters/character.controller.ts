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
import { CharacterService } from './character.service';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { CreateCharacterDTO, fileSchema } from 'swagger';
import { CharacterEntity } from 'modules/database';
import { AdminGuard } from '@guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ONE_MB_IN_BYTES } from '@shared/constants';

@ApiTags('Character')
@ApiBearerAuth()
@Controller()
export class CharacterController {
  constructor(private service: CharacterService) {}

  @ApiOperation({
    summary: 'Get all characters',
  })
  @ApiResponse({ status: 201, type: [CharacterEntity] })
  @Get(API_ROUTES[API_ROUTES_ENUM.CHARACTERS_LIST])
  getAllCharacters() {
    return this.service.getAllCharacters();
  }

  @ApiOperation({
    summary: 'Get my character',
  })
  @ApiResponse({ status: 200, type: CharacterEntity })
  @Get(API_ROUTES[API_ROUTES_ENUM.CHARACTERS_CURRENT])
  getDetails(
    @Param('id', ParseIntPipe) id: number,
    // @Req() { user }: { user: IUser },
  ) {
    return this.service.getCharacter(id);
  }

  @ApiOperation({
    summary: 'Update character',
  })
  @ApiResponse({ status: 200, type: CharacterEntity })
  @UseGuards(AdminGuard)
  @ApiTags('Admins commands')
  @Patch(API_ROUTES[API_ROUTES_ENUM.CHARACTERS_CURRENT])
  updateDetails(
    @Body() data: CreateCharacterDTO,
    @Param('id', ParseIntPipe) id: number,
    // @Req() { user }: { user: IUser },
  ) {
    return this.service.updateCharacter({ ...data, id });
  }

  @ApiOperation({
    summary: 'Create character',
  })
  @ApiResponse({ status: 200, type: CharacterEntity })
  @UseGuards(AdminGuard)
  @ApiTags('Admins commands')
  @Post(API_ROUTES[API_ROUTES_ENUM.CHARACTERS_LIST])
  create(
    @Body() data: CreateCharacterDTO,
    // @Req() { user }: { user: IUser },
  ) {
    return this.service.createCharacter(data);
  }

  @ApiOperation({
    summary: 'Update character image',
  })
  @UseGuards(AdminGuard)
  @ApiTags('Admins commands')
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody(fileSchema)
  @Post(API_ROUTES[API_ROUTES_ENUM.CHARACTERS_CURRENT_IMAGE])
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
    return this.service.updateCharacterImage({ data: file.buffer, id });
  }

  @ApiOperation({
    summary: 'Delete character',
  })
  @ApiTags('Admins commands')
  @ApiResponse({ status: 200, type: CharacterEntity })
  @UseGuards(AdminGuard)
  @Delete(API_ROUTES[API_ROUTES_ENUM.CHARACTERS_CURRENT])
  deleteWeapon(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteCharacter(id);
  }
}
