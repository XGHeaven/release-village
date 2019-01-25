import { ContinualWtiteStream } from './continual-write-stream'
import { mixinRuntimeFolder } from './test'
import { join } from 'path'
import { ContinualReadStream } from './continual-read-stream'
import { createHash, randomBytes } from 'crypto'

describe('ContinualReadStream', () => {
  const runtime = mixinRuntimeFolder('read', __dirname)

  it('should read file', (done) => {
    const size = 1024 * 1024 * 3 + 1024 * 5 + 669
    const filename = join(runtime, 'should-read-file.bin')
    const write = new ContinualWtiteStream(filename, size)

    const writeHash = createHash('md5')
    const readHash = createHash('md5')

    let i = 0
    while (i < size) {
      const buffer = randomBytes(Math.min(1024, size - i))
      write.write(buffer)
      writeHash.update(buffer)
      i += buffer.byteLength
    }

    setTimeout(() => {
      const read = new ContinualReadStream(filename)
      let readSize = 0
      read.on('data', chunk => {
        readHash.update(chunk)
        readSize += chunk.byteLength
      })

      read.on('end', () => {
        expect(readSize).toBe(size)
        expect(writeHash.digest('hex')).toBe(readHash.digest('hex'))
        done()
      })
    }, 10)
  })
})
