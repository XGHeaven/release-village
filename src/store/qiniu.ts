import { Store } from './store'
import { StorePlace } from '../type/store'
import * as qiniu from 'qiniu'
import { Observable, Subject } from 'rxjs'

export class QiniuStore implements Store {
  urlPrefix: string
  type = StorePlace.QINIU
  private config: qiniu.conf.Config
  private mac: qiniu.auth.digest.Mac
  private uploader: qiniu.form_up.FormUploader
  private resume: qiniu.resume_up.ResumeUploader

  constructor(private options: any) {
    this.urlPrefix = options.host
    this.mac = new qiniu.auth.digest.Mac(options.accessKey, options.secretKey)
    const zone = `Zone_${options.zone}`
    this.config = new qiniu.conf.Config({
      zone: (qiniu.zone as any)[zone] || qiniu.zone.Zone_z0,
    })

    this.uploader = new qiniu.form_up.FormUploader(this.config)
    this.resume = new qiniu.resume_up.ResumeUploader(this.config)
  }

  private getToken(objectKey: string): string {
    const policy = new qiniu.rs.PutPolicy({
      scope: `${this.options.bucket}:${objectKey}`,
    })

    return policy.uploadToken(this.mac)
  }

  async putObject(objectKey: string, body: NodeJS.ReadableStream, size: number): Promise<Observable<number>> {
    const token = this.getToken(objectKey)
    const subject = new Subject<number>()
    this.resume.putStream(token, objectKey, body, size, null, (e, respBody, respInfo) => {
      if (e) {
        subject.error(e)
        return
      }

      subject.complete()
    })

    return subject
  }

  deleteObject(objectKey: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
