import { Injectable, Logger } from '@nestjs/common'
import { Agent } from 'http'
import { ConfigService } from 'nestjs-config'
import fetch from 'node-fetch'
import HttpsProxyAgent = require('https-proxy-agent')

@Injectable()
export class DownloadService {
  private readonly agent?: Agent
  private logger: Logger = new Logger('DownloadService', false)

  constructor(private config: ConfigService) {
    const proxy = this.config.get('download.proxy')
    if (proxy) {
      this.agent = new HttpsProxyAgent(proxy)
      this.logger.log(`Enable proxy with "${proxy}"`)
    }
  }

  get(url: string) {
    return fetch(url, {
      method: 'get',
      redirect: 'follow',
      agent: this.agent,
    })
  }
}
