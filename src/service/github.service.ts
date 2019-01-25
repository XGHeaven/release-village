import { Injectable } from '@nestjs/common'
import * as OctokitRest from '@octokit/rest'

@Injectable()
export class GithubService {
  private github = new OctokitRest()

  async getTags(user: string, repo: string): Promise<OctokitRest.ReposListReleasesResponse> {
    const resp = await this.github.repos.listReleases({
      owner: user,
      repo,
    })

    return resp.data
  }

  async getTag(user: string, repo: string, tag: string) {
    const resp = await this.github.repos.getReleaseByTag({
      owner: user,
      repo,
      tag,
    })

    return resp.data
  }
}
