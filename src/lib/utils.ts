import { parse } from 'url'

export function normalizeUrl(url: string): string {
  const parsed = parse(url)
  if (!parsed.hostname) {
    return ''
  }

  return url
}
