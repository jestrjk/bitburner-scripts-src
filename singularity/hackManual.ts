import {NS} from "../NetscriptDefinitions"
import { ServerPath } from "../lib/ServerPath"


interface NetworkNode {
  node_name: string
  child_nodes: NetworkNode[]
}

export function autocomplete(data:any, args:any) {
  return [...data.servers, ...data.script.scripts]
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
      server_path.goToTarget()

      await ns.singularity.manualHack()
    }
  }
}