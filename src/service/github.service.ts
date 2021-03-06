import { Injectable } from '@nestjs/common'
import { ReposListReleasesResponseItem } from '@octokit/rest'
import * as OctokitRest from '@octokit/rest'
import { CommonService } from './common.service'

@Injectable()
export class GithubService {
  private github = new OctokitRest()

  constructor(private common: CommonService) { }

  normalizeRelease(user: string, repo: string, release: ReposListReleasesResponseItem) {
    return {
      mirrorUrl: this.common.getFullUrl(`/${user}/${repo}/tags/${release.tag_name}`),
      githubUrl: release.html_url,
      draft: release.draft,
      preRelease: release.prerelease,
      createdAt: release.created_at,
      publishedAt: release.published_at,
      asstes: release.assets.map(asset => ({
        name: asset.name,
        mirrorDownloadUrl: this.common.getFullUrl(`/${user}/${repo}/download/${release.tag_name}/${asset.name}`),
        githubDownloadUrl: asset.browser_download_url,
        size: asset.size,
      })),
    }
  }

  async getTags(user: string, repo: string): Promise<any[]> {
    const resp = await this.github.repos.listReleases({
      owner: user,
      repo,
    })

    return resp.data.map(rel => this.normalizeRelease(user, repo, rel))
  }

  async getTag(user: string, repo: string, tag: string): Promise<any> {
    const resp = await this.github.repos.getReleaseByTag({
      owner: user,
      repo,
      tag,
    })

    return this.normalizeRelease(user, repo, resp.data)
  }
}
