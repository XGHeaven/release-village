import { ReposListReleasesResponseItem } from '@octokit/rest'

export function normalizeReleaseResult(user: string, repo: string) {
  return (release: ReposListReleasesResponseItem) => ({
    url: `http://localhost:3000/release/${repo}/${user}/tags/${release.tag_name}`,
    originalUrl: release.html_url,
    draft: release.draft,
    preRelease: release.prerelease,
    createdAt: release.created_at,
    publishedAt: release.published_at,
    asstes: release.assets.map(asset => ({
      name: asset.name,
      downloadUrl: `http://localhost:3000/release/${repo}/${user}/download/${release.tag_name}/${asset.name}`,
      originalDownloadUrl: asset.browser_download_url,
      state: asset.state,
    })),
  })
}
