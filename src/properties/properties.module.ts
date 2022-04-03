import { Module } from '@nestjs/common';
import { PropertiesController } from './controllers/properties.controller';

@Module({
  imports: [],
  controllers: [PropertiesController],
  providers: [],
})
export class PropertiesModule {}
