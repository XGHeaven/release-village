import { Store } from './store'
import { NosClient } from '@xgheaven/nos-node-sdk'
import { Subject } from 'rxjs'
import { StorePlace } from '../type/store'

export class NosStore implements Store {
  type = StorePlace.NOS
  urlPrefix: string
  client: NosClient

  constructor(options: any) {
    this.client = new NosClient(options)
    this.urlPrefix = options.urlPrefix
  }

  async putObject(objectKey: string, body: NodeJS.ReadableStream, size: number) {
    const result = this.client.putObject({
      objectKey,
      body,
      length: size,
    })
    const subject = new Subject<number>()

    result.then(() => subject.complete()).catch(e => {
      subject.error(e)
    })

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
