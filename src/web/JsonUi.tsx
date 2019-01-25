import { useState, ReactNode, ReactElement } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import * as React from 'react'
import { normalizeUrl } from '../lib/utils'

const StringItem = styled.span`
  color: green;
`

const NumberItem = styled.span`
  color: #F78C6C;
`

const BooleanItem = styled.span`
  color: red;
`

const IndentItem = styled.div`
  padding-left: 2em;
`

const PropertyName = styled.span`
  color: blue;
`

const Link = styled.a`
  text-decoration: none;
  color: inherit;
  transition: .3s all;
  &:hover {
    color: blue;
  }
`

export function JsonUi(props: {
  value: any,
}): ReactElement<any> {
  const { value } = props

  let node: ReactElement<any>

  switch (typeof value) {
    case 'string':
    const url = normalizeUrl(value)
    let v: any = value
    if (url) {
      v = <Link href={url}>{value}</Link>
    }
    node = <StringItem>"{v}"</StringItem>
    break
    case 'number':
    node = <NumberItem>{value}</NumberItem>
    break
    case 'boolean':
    node = <BooleanItem>{String(value)}</BooleanItem>
    break
    case 'object':
    if (Array.isArray(value)) {
      node = (
        <>
          <span key='start'>[</span>
          <IndentItem>
            {value.map((json, i) => (
              <div key={i}>
                <JsonUi value={json} />
                {i !== value.length - 1 && ','}
              </div>
            ))}
          </IndentItem>
          <span key='end'>]</span>
        </>
      )
    } else if (value !== null) {
      node = (
      <>
        <span key='start'>{'{'}</span>
        <IndentItem>
          {Object.entries(value).map(([key, data], i) => (
            <div key={key}>
              <PropertyName>"{key}"</PropertyName>
              :&nbsp;
              <JsonUi value={data}/>
            </div>
          ))}
        </IndentItem>
        <span key='end'>{'}'}</span>
      </>
      )
    } else {
      node = <div/>
    }
    break
    default:
    node = <div/>
  }

  return node
}
