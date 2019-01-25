import { Controller, Get, Param, Res, UseInterceptors } from '@nestjs/common'
import { Response } from 'express'
import { StoreService } from '../service/store.service'
import { Release } from '../type/release'
import { GithubService } from '../service/github.service'
import { WebifyJsonInterceptor } from '../interceptor/webify-json.interceptor'
import { normalizeReleaseResult } from '../lib/release'

@Controller('/release')
@UseInterceptors(WebifyJsonInterceptor)
export class ReleaseController {
  constructor(private store: StoreService, private github: GithubService) { }

  @Get('/:user/:repo')
  async list(@Param('repo') repo: string, @Param('user') user: string) {
    const releases = await this.github.getTags(user, repo)
    return releases.map(normalizeReleaseResult(repo, user))
  }

  @Get('/:user/:repo/tags/:tag')
  async get(@Param('user') user: string, @Param('repo') repo: string, @Param('tag') tag: string) {
    const release = await this.github.getTag(user, repo, tag)
    return normalizeReleaseResult(user, repo)(release)
  }

  @Get('/:user/:repo/download/:tag/:file')
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
