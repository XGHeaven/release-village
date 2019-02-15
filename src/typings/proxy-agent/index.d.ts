declare module 'proxy-agent' {
  import { Agent } from 'http'

  class ProxyAgentConstructor extends Agent {
    constructor(options: string | object)
  }

  export = ProxyAgentConstructor
}
