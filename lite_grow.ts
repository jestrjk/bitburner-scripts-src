/* eslint-disable */
import {NS} from "./NetscriptDefinitions"
import * as PM from "./lib_PortManager"

export async function main(ns: NS) {
  try {
    let pm = PM.getPortManager(ns, PM.PortNumbers.liteScriptResults )

    let target:string = ns.args[0] as string
    let grow_result = await ns.grow( target ) 

    let result:PM.LiteScriptJSONParams = {
      result: grow_result,
      hostname: target, 
      hacktype: PM.hackTypes.grow
    }

    pm.writeJSONPort( result ) 
  } catch(err) {throw err}
}

