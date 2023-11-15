import {NS} from "./NetscriptDefinitions"
import * as PM from "./lib_PortManager"

export async function main (ns:NS) {
  ns.tail()
  ns.print( `Tail`)
  let pm = PM.getPortManager(ns,PM.PortNumbers.liteScriptResults) 
  ns.print( `PM.getPortManager()`)
  while (true) {
    try {
      ns.print( `[${ns.getScriptName()}] while(true)`)

      let results = pm.readJSONPort()
      ns.print( JSON.stringify( results, null, 1 ))
    } catch ( err ) { ns.print( err ) }
    
    await ns.asleep( 1000 )
  }
}