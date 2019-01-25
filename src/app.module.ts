import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from 'nestjs-config'
import { resolve } from 'path'
import { ReleaseController } from './controller/release.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Record } from './entity/record.entity'
import { StoreService } from './service/store.service'
import { AppController } from './controller/app.controller'
import { GithubService } from './service/github.service'
import { DownloadService } from './service/download.service'

@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, '../config/**/*.{js,json}')),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Record]),
  ],
  controllers: [AppController, ReleaseController],
  providers: [StoreService, GithubService, DownloadService],
})
export class AppModule { }
