// test helper

import { join } from 'path'
import * as mkdirp from 'make-dir'
import * as rimraf from 'rimraf'

export function mixinRuntimeFolder(name: string, testDir: string) {
  const dirname = `__runtime__/${name}-${Date.now()}`
  const dirpath = join(testDir, dirname)

  beforeAll(() => {
    mkdirp.sync(dirpath)
  })

  afterAll(() => {
    rimraf.sync(dirpath)
  })

  return dirpath
}
