import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  user: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: 'example@example.com' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ minimum: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // rol: string;
}
