import {NS} from "./NetscriptDefinitions"
import * as PM from "./lib_PortManager"

/** @param {NS} ns */
export async function main(ns : NS) {
  try {
    let pm = PM.getPortManager(ns, PM.PortNumbers.liteScriptResults )

    let target: string  = ns.args[0] as string
    let hack_result = await ns.hack( target )
    
    pm.writeJSONPort({hacktype: PM.hackTypes.hack, result: hack_result, hostname: target }) 

  } catch(err) {throw err}
  
}

