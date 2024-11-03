import { ApiProperty } from '@nestjs/swagger';
import { CreateUserType, LoginUserType } from '@shared/interface';

export class LoginDTO implements LoginUserType {
  @ApiProperty({ example: 'qweQWE123' })
  password: string;

  @ApiProperty({ example: 'admin' })
  username: string;
}

export class RegistrationDTO
  implements
    Required<Omit<CreateUserType, 'auth_date' | 'telegram_id' | 'photo_url'>>
{
  @ApiProperty({ example: 'qweQWE123' })
  password: string;

  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'https://path/to/photo.google.com' })
  photo_url?: string;
}

export class TokenDTO {
  @ApiProperty({
    description: 'Bearer',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTA0MjY4NDMsImV4cCI6MTcxMDUxMzI0M30.2UjjGb6fBNW7UEycS1GIYX1ElBGokNHpEBOP86Cpf8A',
    required: true,
  })
  token: string;
}
