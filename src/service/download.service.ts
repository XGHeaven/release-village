import { Injectable } from '@nestjs/common'
import { ConfigService } from 'nestjs-config'
import { Agent } from 'http'
import fetch from 'node-fetch'

import ProxyAgent = require('proxy-agent')

@Injectable()
export class DownloadService {
  private agent?: Agent
  constructor(private config: ConfigService) {
    const proxy = config.get('download.proxy')
    if (proxy) {
      this.agent = new ProxyAgent(proxy)
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
