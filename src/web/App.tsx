import { JsonUi } from './JsonUi'
import * as React from 'react'

export function App(props: { value: any }) {
  return (
    <pre>
      <JsonUi value={props.value}/>
    </pre>
  )
}
