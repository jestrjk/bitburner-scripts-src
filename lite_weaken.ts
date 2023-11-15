/* eslint-disable */
import {NS} from "./NetscriptDefinitions"
import * as PM from "./lib_PortManager"

/** @param {NS} ns */
export async function main(ns: NS) {
   try {
    let pm = PM.portManager(ns, PM.PortNumbers.liteScriptResults )
    let target  = ns.args[0] as string
    let weaken_result = await ns.weaken( target )
    
    pm.writeJSONPort( { result: weaken_result,hostname:target, hacktype: PM.hackTypes.weaken } )
  
  } catch(err) {throw err}
  
}

