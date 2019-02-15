import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { WebifyJsonInterceptor } from '../interceptor/webify-json.interceptor'

const introduce = {
  name: 'release-village',
  description: 'A Github Release Download Mirror for China',
  howToUse: [
    '1. Find which release you want to download',
    '2. Copy user, repo, tag, filename',
    '3. Change url to /:user/:repo/download/:tag/:filename',
    '4. Downloading started',
  ],
  moreSampleWay: [
    '1. Open Github release page',
    '2. Change github.com origin to release-village.xgheaven.com',
    '3. Choose which release you want to download',
  ],
  github: 'TODO',
  poweredBy: ['https://163yum.com/nos'],
}

@UseInterceptors(WebifyJsonInterceptor)
@Controller('/')
export class AppController {
  @Get('/')
  async index() {
    return introduce
  }

  @Get('/health')
  async health() {
    return {
      status: 'health',
    }
  }
}
