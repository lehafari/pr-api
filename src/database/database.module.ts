import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import config from 'src/config/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { host, port, username, password, name } = configService.database;

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database: name,
          entities: [join(__dirname, '../**/models/**.model{.ts,.js}')],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
