import { ServerTargetList } from "./ServerTargetList"

export interface ServerAction {
  hostname: string
  description: string
  expires: number
  timestamp: number
}

export interface SingularityAction {
  pid:              number
  target_hostname:  string
  action:           string
  time_to_live:     number
}
   
function refresh (ns:NS) {
  data.server_targets = new ServerTargetList(ns)
  data.player         = ns.getPlayer()

  if ( !data.server_actions ) {
    data.server_actions = []
  }
}

function cleanServerActions () {
  data.server_actions = data.server_actions!.filter( d=>(d.expires > Date.now()) )
}

export interface GlobalData {
  server_targets: ServerTargetList
  server_actions: ServerAction[]
  player: Player
}

const data: Partial<GlobalData> = {}

export function getData(): GlobalData {
  return data as GlobalData
}

export async function main ( ns:NS ) { 
  ns.tail()
  ns.disableLog( "scan" )

  while ( true ) {
    refresh(ns)
    cleanServerActions()

    let now = new Date()
    ns.print( now.toISOString() )
    await ns.sleep(500) 
  }
}

