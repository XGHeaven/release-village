import { Readable, Transform, TransformCallback } from 'stream'
import { createReadStream, ReadStream } from 'fs'

export class ContinualRetryReadError extends Error {
  name = 'ContinualRetryReadError'
}

export class ContinualReadStream extends Transform {
  private stream!: ReadStream
  private size!: number
  private readSize: number = 0
  /**
   * 获取文件大小重试次数
   */
  private sizeRetry: number = 0
  private initRetry: number = 0
  public inited: Promise<{
    size: number,
  }> = new Promise((resolve, reject) => {
    this.once('inited', () => {
      resolve({
        size: this.size - 4,
      })
    })
    this.once('error', reject)
  })

  constructor(private file: string, private options: {
    delay?: number,
  } = {}) {
    super()
    this.on('drain', this.onDrain)
    setTimeout(() => this.tryCreateStream(), options.delay || 0)
  }

  initSize = () => {
    // 初始化获取文件大小
    const sizeBuf: Buffer | null = this.stream.read(4)
    this.sizeRetry++

    if (!sizeBuf || sizeBuf.byteLength !== 4) {
      // 一共重试 4 次，间隔 1s
      if (this.sizeRetry <= 3) {
        setTimeout(this.initSize, 1000)
      } else {
        this.emit('error', new ContinualRetryReadError())
      }
      return
    }

    // 需要添加头部的 4 个字节大小
    this.size = (new Int32Array(sizeBuf.buffer))[0] + 4
    this.readSize += 4
    this.emit('inited')
    this.start()
  }

  /**
   * 尝试创建流，如果一开始没有数据写入，那么就重试 3 次
   */
  tryCreateStream() {
    this.createStream()

    const error = (e: Error) => {
      this.stream.off('readable', readable)
      if (++this.initRetry < 3) {
        setTimeout(() => this.tryCreateStream(), 1000)
      } else {
        this.destroy(e)
      }
    }

    const readable = () => {
      this.stream.off('error', error)
      this.initSize()
    }

    this.stream.once('error', error)
    this.stream.once('readable', readable)
  }

  createStream() {
    this.stream = createReadStream(this.file, {
      start: this.readSize,
    })
  }

  start() {
    this.stream.on('end', this.onEnd)
    this.stream.on('data', this.onData)
    this.stream.resume()
  }

  _transform(chunk: Buffer, encode: string, cb: TransformCallback) {
    cb(void 0, chunk)
  }

  onEnd = () => {
    if (this.readSize < this.size) {
      // 给予 1s 的启动延迟
      setTimeout(() => {
        this.createStream()
        this.start()
      }, 1000)
    } else {
      this.end()
    }
  }

  onData = (chunk: Buffer) => {
    const ret = this.write(chunk)
    this.readSize += chunk.length
    if (this.writable && !ret) {
      this.stream.pause()
    }
  }

  onDrain = () => {
    if (this.stream.isPaused()) {
      this.stream.resume()
    }
  }
}
