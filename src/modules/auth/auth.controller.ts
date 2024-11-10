import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { LoginDTO, RegistrationDTO, TokenDTO } from 'swagger';

@ApiTags('Authorization')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({
    summary: 'login user',
  })
  @ApiResponse({ status: 201, type: TokenDTO })
  @Post(API_ROUTES[API_ROUTES_ENUM.AUTH_LOGIN])
  login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }

  @ApiOperation({
    summary: 'registration new user',
  })
  @ApiResponse({ status: 201, type: TokenDTO })
  @Post(API_ROUTES[API_ROUTES_ENUM.AUTH_REGISTRATION])
  registration(@Body() data: RegistrationDTO) {
    return this.authService.registration(data);
  }
}
