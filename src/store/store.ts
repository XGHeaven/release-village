import { Observable } from 'rxjs'
import { NosStore } from './nos'
import { StorePlace as StoreType } from '../type/store'
import { QiniuStore } from './qiniu'

export abstract class Store {
  static create(options: {
    type: StoreType,
    [options: string]: any,
  }): Store {
    const {type, ...values} = options

    switch (type) {
      case StoreType.NOS:
      return new NosStore(values)
      case StoreType.QINIU:
      return new QiniuStore(values)
    }

    throw new Error(`Cannot found ${type} store`)
  }

  abstract type: StoreType
  abstract urlPrefix: string

  abstract putObject(objectKey: string, body: NodeJS.ReadableStream, size: number): Promise<Observable<number>>

  abstract deleteObject(objectKey: string): Promise<boolean>
}
