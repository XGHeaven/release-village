import { Controller, Get, Param, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { posix } from 'path'
import { format, parse } from 'url'

/**
 * 兼容 Github
 */
@Controller('/')
export class CompactController {
  @Get('/:user/:repo/releases')
  releases(@Req() req: Request, @Res() res: Response) {
    const uri = parse(req.url)
    const redirectUri = format({
      ...uri,
      pathname: posix.resolve(uri.pathname || '', '..'),
    })

    res.redirect(redirectUri)
  }

  @Get('/:user/:repo/releases/tag/:tag')
  tag(@Req() req: Request, @Res() res: Response, @Param('user') user: string, @Param('repo') repo: string, @Param('tag') tag: string) {
    const uri = parse(req.url)
    res.redirect(format({
      ...uri,
      pathname: `/${user}/${repo}/tags/${tag}`,
    }))
  }

  @Get('/:user/:repo/releases/download/:tag/:file')
  download(
    @Req() req: Request,
    @Res() res: Response,
    @Param('user') user: string,
    @Param('repo') repo: string,
    @Param('tag') tag: string,
    @Param('file') file: string
  ) {
    const uri = parse(req.url)
    res.redirect(format({
      ...uri,
      pathname: `/${user}/${repo}/download/${tag}/${file}`,
    }))
  }
}
