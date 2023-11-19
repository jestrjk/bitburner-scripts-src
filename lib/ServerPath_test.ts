import { NS } from "../NetscriptDefinitions";
import { ServerPath } from "./ServerPath";

export async function main(ns:NS) {
  ns.clearLog()
  ns.tail()

  let server_path = new ServerPath( ns, <string> ns.args[0], <string>ns.args[1] )
  
  ns.print( `Path: ${JSON.stringify( server_path.path, null, 1)}`)
  ns.print( `Visited: ${JSON.stringify( server_path.visited, null, 1)}`)
}