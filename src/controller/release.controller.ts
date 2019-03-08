import { Controller, Get, Header, Param, Res, UseInterceptors } from '@nestjs/common'
import { Response } from 'express'
import { WebifyJsonInterceptor } from '../interceptor/webify-json.interceptor'
import { GithubService } from '../service/github.service'
import { StoreService } from '../service/store.service'
import { Release } from '../type/release'

@Controller('/')
@UseInterceptors(WebifyJsonInterceptor)
export class ReleaseController {
  constructor(private store: StoreService, private github: GithubService) { }

  @Get('/:user/:repo')
  async list(@Param('repo') repo: string, @Param('user') user: string) {
    return await this.github.getTags(user, repo)
  }

  @Get('/:user/:repo/tags/:tag')
  async get(@Param('user') user: string, @Param('repo') repo: string, @Param('tag') tag: string) {
    return await this.github.getTag(user, repo, tag)
  }

  @Get('/:user/:repo/download/:tag/:file')
  @Header('content-type', 'application/octet-stream')
  async download(@Param() param: Release, @Res() resp: Response) {
    const data = await this.store.download(param)

    if (typeof data === 'string') {
      resp.redirect(data)
    } else {
      const info = await data.inited
      resp.setHeader('content-length', info.size)
      data.pipe(resp)
    }
  }
}
