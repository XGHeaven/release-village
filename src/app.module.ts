import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from 'nestjs-config'
import { resolve } from 'path'
import { CompactController } from './controller/compact.controller'
import { ReleaseController } from './controller/release.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Record } from './entity/record.entity'
import { CommonService } from './service/common.service'
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
  controllers: [AppController, CompactController, ReleaseController],
  providers: [StoreService, GithubService, DownloadService, CommonService],
})
export class AppModule implements OnModuleInit {
  onModuleInit(): any {
    // tslint:disable-next-line
    console.log(JSON.stringify((ConfigService as any).config, null, 2))
  }
}
