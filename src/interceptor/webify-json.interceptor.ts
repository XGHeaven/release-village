import { Injectable, NestInterceptor, ExecutionContext, Logger, UseInterceptors } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Request, Response } from 'express'
import { renderToString } from 'react-dom/server'
import { App } from '../web/App'
import { createElement } from 'react'

function render(data: any) {
  return renderToString(
    createElement(App, {
      value: data,
    }),
  )
}

@Injectable()
export class WebifyJsonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: Observable<object>): Observable<any> {
    return call$.pipe(
      map(json => {
        const req: Request = context.getArgByIndex(0)
        const resp: Response = context.getArgByIndex(1)
        const contentType = req.headers.accept || ''
        if (contentType.indexOf('text/html') !== -1) {
          resp.header('content-type', 'text/html; charset=utf-8')
          return `<html><body><div id="app">${render(json)}</div></body></html>`
        } else {
          resp.header('content-type', 'application/json; charset=utf-8')
          const noPretty = 'no-pretty' in req.query

          if (!noPretty) {
            return JSON.stringify(json, null, 2)
          } else {
            return JSON.stringify(json)
          }
        }
      }),
    )
  }
}

export function Webify(target: any, prop: string, desc: any) {
  return UseInterceptors(WebifyJsonInterceptor)(target, prop, desc)
}
