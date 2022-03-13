import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  userOrEmail: string;

  @ApiProperty({ minimum: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
