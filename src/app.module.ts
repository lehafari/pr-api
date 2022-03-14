import { Module } from '@nestjs/common';
import { ConfigModule } from './config/cofig.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    PropertiesModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
