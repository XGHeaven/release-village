import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { lookup } from 'dns'
import { ConfigService } from 'nestjs-config'
import { Agent } from 'http'
import fetch from 'node-fetch'
import { parse } from 'url'

import ProxyAgent = require('proxy-agent')

@Injectable()
export class DownloadService implements OnModuleInit {
  private agent?: Agent
  private logger: Logger = new Logger('DownloadService', false)
  constructor(private config: ConfigService) { }

  async onModuleInit() {
    const proxyString = this.config.get('download.proxy')
    if (proxyString) {
      const uri = parse(proxyString)
      // 自己解析 ip 地址
      await new Promise((resolve, reject) => {
        lookup(uri.hostname!, (e, ip) => {
          if (e) {
            this.logger.warn('Found proxy config but cannot lookup dns, so disabled.')
            return
          }

          uri.hostname = ip
        })

        this.agent = new ProxyAgent(uri)
        resolve()
      })

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
