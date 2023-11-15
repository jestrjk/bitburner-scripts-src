/* eslint-disable */
import {NS} from "./NetscriptDefinitions"
import * as PM from "./lib_PortManager"

export async function main(ns: NS) {
  try {
    let pm = PM.portManager(ns, PM.PortNumbers.liteScriptResults )

    let target  = ns.args[0] as string
    let grow_result = await ns.grow( target ) 

    pm.writeJSONPort( {result: grow_result, hostname: target, hacktype: PM.hackTypes.grow }) 
  } catch(err) {throw err}
}

