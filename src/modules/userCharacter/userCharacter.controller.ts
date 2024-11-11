import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserCharacterService } from './userCharacter.service';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { UserCharacterEntity } from 'modules/database';
import { AuthGuard } from '@guards/auth.guard';
import { UserType } from '@shared/interface';
import { CreateMyCharacterDTO, UpdateUserCharacterDTO } from 'swagger';

@ApiTags('User Characters')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class UserCharacterController {
  constructor(private service: UserCharacterService) {}

  @ApiOperation({
    summary: 'Get all my characters',
  })
  @ApiResponse({ status: 201, type: [UserCharacterEntity] })
  @Get(API_ROUTES[API_ROUTES_ENUM.MY_CHARACTERS])
  getAllMyCharacters(@Req() { user }: { user: UserType }) {
    return this.service.getUserCharacters(user.id);
  }

  @ApiOperation({
    summary: 'Get all user characters',
  })
  @ApiResponse({ status: 201, type: [UserCharacterEntity] })
  @Get(API_ROUTES[API_ROUTES_ENUM.USER_CURRENT_CHARACTERS])
  getAllUserCharacters(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUserCharacters(id);
  }

  @ApiOperation({
    summary: 'Add to my characters',
  })
  @ApiResponse({ status: 201, type: UserCharacterEntity })
  @Post(API_ROUTES[API_ROUTES_ENUM.MY_CHARACTERS])
  createMyCharacter(
    @Body() { characterId }: CreateMyCharacterDTO,
    @Req() { user }: { user: UserType },
  ) {
    return this.service.createUserCharacter({ characterId, userId: user.id });
  }

  @ApiOperation({
    summary: 'Update my characters',
  })
  @ApiResponse({ status: 201, type: UserCharacterEntity })
  @Patch(API_ROUTES[API_ROUTES_ENUM.MY_CHARACTERS_CURRENT])
  updateMyCharacter(
    @Body() data: UpdateUserCharacterDTO,
    @Param('id', ParseIntPipe) id: number,
    @Req() { user }: { user: UserType },
  ) {
    return this.service.updateUserCharacter({ ...data, id, userId: user.id });
  }

  @ApiOperation({
    summary: 'Delete my characters',
  })
  @ApiResponse({ status: 201, type: UserCharacterEntity })
  @Delete(API_ROUTES[API_ROUTES_ENUM.MY_CHARACTERS_CURRENT])
  deleteMyCharacter(
    @Param('id', ParseIntPipe) id: number,
    @Req() { user }: { user: UserType },
  ) {
    return this.service.deleteUserCharacter(id, user.id);
  }

  @ApiOperation({
    summary: 'Get my character',
  })
  @ApiResponse({ status: 201, type: UserCharacterEntity })
  @Get(API_ROUTES[API_ROUTES_ENUM.MY_CHARACTERS_CURRENT])
  getMyCharacter(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUserCharacter(id);
  }
}
