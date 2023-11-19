import {NS} from "../NetscriptDefinitions"
import {getUtilityHosts,getAllServers} from "../lib/ServerList"
import { ServerPath } from "../lib/ServerPath"

interface NetworkNode {
  node_name: string
  child_nodes: NetworkNode[]
}

export async function main(ns:NS) {
  ns.tail()
  //ns.disableLog( "sleep")
  //ns.disableLog( "scan")
  ns.disableLog( "scan" )
  
  let target_servers = <string[]>ns.args 

  while ( true ) {
    for ( let target of target_servers) {
      
      let server_path = new ServerPath(ns,ns.singularity.getCurrentServer(), target )
      ns.print( `Pathing from ${ns.singularity.getCurrentServer()} to ${target}`)
      server_path.goToTarget()
      ns.print( `Arrival: ${ns.singularity.getCurrentServer()}`)

      await ns.singularity.manualHack()
    }
  }
}