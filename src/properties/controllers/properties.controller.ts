import { Controller, Put } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreatePropertieDto } from '../dto';

@Controller('properties')
export class PropertiesController {
  @ApiBody({ type: CreatePropertieDto })
  @Put('create')
  create(): string {
    return 'Properties create';
  }
}
