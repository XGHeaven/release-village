import { Injectable } from '@nestjs/common'
import { ConfigService } from 'nestjs-config'
import { format, parse, resolve } from 'url'

@Injectable()
export class CommonService {
  urlHost: string
  urlProtocol: string
  urlPrefix: string

  constructor(private config: ConfigService) {
    const url = parse(this.config.get('common.urlPrefix'))
    this.urlHost = url.host || ''
    this.urlProtocol = url.protocol || 'http'
    this.urlPrefix = format({
      protocol: this.urlProtocol,
      host: this.urlHost,
    })
  }

  getFullUrl(uri: string): string {
    return resolve(this.urlPrefix, uri)
  }
}
