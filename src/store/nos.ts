import { Store } from './store'
import { NosClient } from '@xgheaven/nos-node-sdk'
import { Subject } from 'rxjs'
import { StorePlace } from '../type/store'

export class NosStore implements Store {
  static MAX_UPLOAD_PART = 8 * 1024 * 1024
  type = StorePlace.NOS
  urlPrefix: string
  maxPart: number
  client: NosClient

  constructor(options: any) {
    this.client = new NosClient(options)
    this.urlPrefix = options.urlPrefix
    this.maxPart = options.maxPart || NosStore.MAX_UPLOAD_PART
  }

  async putObject(objectKey: string, body: NodeJS.ReadableStream, size: number) {
    const subject = new Subject<number>()
    if (size < this.maxPart) {
      const result = this.client.putObject({
        objectKey,
        body,
        length: size,
      })

      result.then(() => subject.complete()).catch(e => {
        subject.error(e)
      })
    } else {
      const result = this.client.putBigObject({
        objectKey,
        body,
        parallel: 2,
        maxPart: this.maxPart,
        onProgress: (progress) => {
          subject.next(progress.uploaded / size)
        },
      })

      result.then(() => subject.complete(), e => subject.error(e))
    }

    return subject
  }

  async deleteObject(objectKey: string) {
    try {
      await this.client.deleteObject({objectKey})
      return true
    } catch (e) {
      return false
    }
  }
}
