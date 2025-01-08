import { CustomServerDataList } from "./CustomServerDataList"

export interface ServerAction {
  hostname: string
  description: string
  expires: number
  timestamp: number
  script_host?: string
}

export interface SingularityAction {
  pid:              number
  target_hostname:  string
  action:           string
  time_to_live:     number
}

export interface _GlobalData {
  server_actions: ServerAction[],
}

export class GlobalData {
  constructor(ns:NS) {
    this.ns = ns
    this.server_targets = new CustomServerDataList(ns)
  }


  ns:NS
  server_targets: CustomServerDataList
  server_actions: ServerAction[] = []
  created: Date = new Date() 

  refresh() {
    this.cleanServerActions()
    this.server_targets = new CustomServerDataList( this.ns ) 
  }
  
  cleanServerActions () {
    this.server_actions = this.server_actions.filter( d=>(d.expires > Date.now()) )
  }
  
}
