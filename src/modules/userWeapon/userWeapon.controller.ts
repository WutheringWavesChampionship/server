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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserWeaponService } from './userWeapon.service';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { UserWeaponEntity } from 'modules/database';
import { AuthGuard } from '@guards/auth.guard';
import { UserType } from '@shared/interface';
import { CreateMyWeaponDTO, UpdateUserWeaponDTO } from 'swagger';

@ApiTags('User weapons')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class UserWeaponController {
  constructor(private service: UserWeaponService) {}

  @ApiOperation({
    summary: 'Get all my weapons',
  })
  @ApiResponse({ status: 201, type: [UserWeaponEntity] })
  @Get(API_ROUTES[API_ROUTES_ENUM.MY_WEAPONS])
  getAllMyWeapons(@Req() { user }: { user: UserType }) {
    return this.service.getUserWeapons(user.id);
  }

  @ApiOperation({
    summary: 'Get all user weapons',
  })
  @ApiResponse({ status: 201, type: [UserWeaponEntity] })
  @Get(API_ROUTES[API_ROUTES_ENUM.USER_CURRENT_WEAPONS])
  getAllUserWeapons(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUserWeapons(id);
  }

  @ApiOperation({
    summary: 'Add to my weapons',
  })
  @ApiResponse({ status: 201, type: UserWeaponEntity })
  @Post(API_ROUTES[API_ROUTES_ENUM.MY_WEAPONS])
  createMyCharacter(
    @Body() { weaponId }: CreateMyWeaponDTO,
    @Req() { user }: { user: UserType },
  ) {
    return this.service.createUserWeapon({ weaponId, userId: user.id });
  }

  @ApiOperation({
    summary: 'Update my weapon',
  })
  @ApiResponse({ status: 201, type: UserWeaponEntity })
  @Patch(API_ROUTES[API_ROUTES_ENUM.MY_WEAPONS_CURRENT])
  updateMyWeapon(
    @Body() data: UpdateUserWeaponDTO,
    @Param('id', ParseIntPipe) id: number,
    @Req() { user }: { user: UserType },
  ) {
    return this.service.updateUserWeapon({ ...data, id, userId: user.id });
  }
  @ApiOperation({
    summary: 'Get my weapon',
  })
  @ApiResponse({ status: 201, type: UserWeaponEntity })
  @Get(API_ROUTES[API_ROUTES_ENUM.MY_WEAPONS_CURRENT])
  getMyCharacter(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUserWeapon(id);
  }
}
