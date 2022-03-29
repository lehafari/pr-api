import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class updateUserDto {
  @ApiProperty()
  user: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty({ example: 'example@example.com' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  nit: string;

  @ApiProperty()
  fiscalname: string;

  @ApiProperty()
  fiscaladdress: string;
}
