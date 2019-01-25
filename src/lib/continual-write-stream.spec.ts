import * as fs from 'fs'
import * as mkdirp from 'make-dir'
import * as rimraf from 'rimraf'
import { join } from 'path'
import { ContinualWtiteStream } from './continual-write-stream'
import { createHash, randomBytes } from 'crypto'
import { createReadStream } from 'fs'
import { mixinRuntimeFolder } from './test'

describe('ContinualWriteStream', () => {
  const dirpath = mixinRuntimeFolder('write', __dirname)

  it('base usage', (done) => {
    const size = 1024 * 1024 * 3 + 1024 * 3 + 33 // 3M + 3k + 33B
    const filepath = join(dirpath, 'basic-file.bin')
    const stream = new ContinualWtiteStream(filepath, size)
    const digistSource = createHash('md5')
    const digistDest = createHash('md5')

    let i = 0
    while ( i < size ) {
      const buffer = randomBytes(Math.min(1024, size - i))
      stream.write(buffer)
      digistSource.update(buffer)
      i += buffer.byteLength
    }

    stream.end()
    stream.on('finish', () => {
      const readStream = createReadStream(filepath)
      let readSize = 0

      readStream.on('data', chunk => {
        if (!readSize) {
          chunk = chunk.slice(4)
        }
        digistDest.update(chunk)
        readSize += chunk.byteLength
      })

      readStream.on('end', () => {
        expect(readSize).toBe(size)
        expect(digistSource.digest('hex')).toBe(digistDest.digest('hex'))
        done()
      })
    })
  })

  it('should only one stream can write', (done) => {
    const filepath = join(dirpath, 'write-lock.bin')
    const stream1 = new ContinualWtiteStream(filepath, 100)
    const stream2 = new ContinualWtiteStream(filepath, 200)

    stream2.on('error', e => {
      console.log(e)
    })

    stream2.on('finish', () => {
      console.log('finish 2')
      console.log(fs.statSync(filepath).size)
      done()
    })

    stream1.on('finish', () => {
      console.log('finish')
    })

    stream1.on('error', e => {
      console.error(e, '1')
    })

    stream1.write(randomBytes(100))
    stream2.write(randomBytes(200))

    stream1.end()
    stream2.end()
  })
})
