import { ServerData } from "./ServerData"
import { ServerAction } from "./ServerAction"

export interface SingularityAction {
  pid:              number
  target_hostname:  string
  action:           string
  time_to_live:     number
}

export interface GlobalData {
  server: {
    names: string[] 
    data: ServerData[]  
    actions: ServerAction[]
  }
}

export const data: GlobalData = {
  server: {
    names: [],
    data: [],
    actions: [],
  }
}
  
export function cleanServerActions () {
  data.server.actions = data.server.actions = data.server.actions.filter( d=>(d.expires > Date.now()) )
}


export function getValidHackTargets() {
  let hack_targets = data.server.data.filter( s =>
    ( s.server.hasAdminRights ) && 
    ( s.server.moneyMax! > 0 )
  )

  if ( hack_targets && hack_targets.length > 1 ) {
    return hack_targets
  } else {
    throw( `No valid hack targets` )
  }
}

export function getScriptHosts() {
  return data.server.data.filter( s=>s.server.purchasedByPlayer )
}

export function getBestScriptHost( required_ram: number ) {
  for( let script_host of getScriptHosts() ) {
    let available_ram = script_host.server.maxRam - script_host.server.ramUsed

    if ( available_ram > required_ram ) {
      return script_host
    }
  } 

  return null
}



function recursiveServerScan(ns:NS, parent_host_name = 'home'): void {
  
  let new_server_names = ns.scan( parent_host_name )
  
  for ( let new_server_name of new_server_names ) {
    if ( data.server.names.find( hostname=>hostname == new_server_name )) {
      continue;
    } else {
      data.server.names.push( new_server_name )
      recursiveServerScan( ns, new_server_name )
    }
  }
}



export async function main ( ns:NS ) {
  ns.tail() 
  ns.disableLog( "scan" )


  while ( true ) {
    ns.clearLog()
    
    recursiveServerScan( ns ) // Builds names

    let new_server_data: ServerData[] = []
    ns.print( `${new Date().toISOString()}: Scanning ${data.server.names.length} servers` )
    for ( let server_name of data.server.names ) {
      new_server_data.push( new ServerData( ns, server_name ) )
    }

    data.server.data = new_server_data

    cleanServerActions() // gets rid of old actions logged

    ns.print( `${new Date().toISOString()}: Scanned ${data.server.names.length} servers` )
    ns.print( new Date().toISOString() )
    await ns.sleep( 1000 ) 
  }
}
