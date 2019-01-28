import { Writable } from 'stream'
import { WriteStream, createWriteStream, open, constants } from 'fs'
import * as mkdirp from 'make-dir'
import { dirname } from 'path'

export class ContinualWtiteStream extends Writable {
  private fd!: number
  private stream!: WriteStream
  private inited: boolean = false

  constructor(private filepath: string, private size: number) {
    super()
    this.init()
    this.writable = false
  }

  init() {
    if (this.inited) { return }
    this.inited = true
    mkdirp.sync(dirname(this.filepath))
    // 获得所有权
    open(this.filepath, constants.O_CREAT + constants.O_EXCL + constants.O_WRONLY, (e, fd) => {
      if (e) {
        this.destroy(e)
        return
      }

      this.fd = fd
      const stream = this.stream = createWriteStream(this.filepath, { fd })
      const arrBuf = new Uint32Array(1)
      arrBuf[0] = this.size

      stream.write(Buffer.from(arrBuf.buffer))
      this.emit('init')
      this.writable = true
    })
  }

  _write(chunk: Buffer, encoding: string, cb: (e?: Error | null) => void) {
    if (!this.stream) {
      this.init()
      this.once('init', () => this._write(chunk, encoding, cb))
    } else {
      this.stream.write(chunk, cb)
    }
  }
}
