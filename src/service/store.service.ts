import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { existsSync } from 'fs'
import { ConfigService } from 'nestjs-config'
import { join } from 'path'
import * as url from 'url'
import { Record } from '../entity/record.entity'
import { ContinualReadStream } from '../lib/continual-read-stream'
import { ContinualWtiteStream } from '../lib/continual-write-stream'
import { Store } from '../store/store'
import { Release } from '../type/release'
import { Repository } from 'typeorm'
import { DownloadService } from './download.service'

@Injectable()
export class StoreService {
  private stores: Store[] = []
  private logger = new Logger('StoreService')

  constructor(
    @InjectRepository(Record) private recordRepo: Repository<Record>,
    private configService: ConfigService,
    private downloadService: DownloadService,
  ) {
    let storeConfig = this.configService.get('store')
    if (!Array.isArray(storeConfig)) {
      storeConfig = [storeConfig]
    }

    for (const config of storeConfig) {
      if (!config.type) {
        this.logger.warn('Please special store type in config file')
        continue
      }
      this.stores.push(Store.create(config))
    }

    this.logger.log(`init ${this.stores.length} stores`)
  }

  async download(rel: Release): Promise<ContinualReadStream | string> {
    const savedRecord = await this.recordRepo.findOne({where: {
      user: rel.user,
      repo: rel.repo,
      tag: rel.tag,
      file: rel.file,
    }})

    if (savedRecord) {
      return savedRecord.url
    }

    const localFile = this.getLoadFile(rel)
    this.logger.log(localFile)
    if (existsSync(localFile)) {
      return new ContinualReadStream(localFile)
    }

    const resp = await this.downloadService.get(this.getGithubRelease(rel))

    const size = parseInt(resp.headers.get('content-length') || '0', 10)
    const writable = new ContinualWtiteStream(localFile, size)

    this.logger.log(`Fetch release of ${rel.file} with ${resp.status}/${size}`)

    // 是否能够争夺到写入锁
    const canWrite = await new Promise<boolean>((resolve) => {
      writable.once('error', e => {
        resolve(false)
        this.logger.error(e)
      })

      writable.once('init', () => {
        resolve(true)
      })
    })

    // 如果不能，那么就直接返回读取流
    if (!canWrite) {
      return new ContinualReadStream(localFile)
    }

    resp.body.pipe(writable)

    // this.putObject(rel, new ContinualReadStream(localFile), size)

    resp.body.on('error', this.logger.error)
    resp.body.on('end', () => this.logger.log(`Download end of ${rel.file}`))

    return new ContinualReadStream(localFile)
  }

  getLoadFile(release: Release): string {
    return join(this.configService.get('download.tmpDir'), release.user, release.repo, release.tag, release.file)
  }

  getGithubRelease(release: Release): string {
    return `https://github.com/${release.user}/${release.repo}/releases/download/${release.tag}/${release.file}`
  }

  getReleasePath(rel: Release): string {
    return `${rel.user}/${rel.repo}/${rel.tag}/${rel.file}`
  }

  getStore(): Store {
    return this.stores[Math.floor(Math.random() * this.stores.length)]
  }

  putObject(rel: Release, body: NodeJS.ReadableStream, size: number): void {
    const store = this.getStore()
    const key = this.getReleasePath(rel)
    store.putObject(key, body, size).then(ob => {
      ob.subscribe(this.logger.log, this.logger.error, () => {
        this.logger.log(`Upload success of ${rel.file}`)
        const record = this.recordRepo.create({
          ...rel,
          store: store.type,
          url: url.resolve(store.urlPrefix, key),
        })
        this.recordRepo.save(record).then(() => {
          // TODO: 上传完毕之后延迟删除文件
          // rimraf.sync(this.getLoadFile(rel))
        }).catch(this.logger.error)
      })
    }).catch(this.logger.error)
  }
}
