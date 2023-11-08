/* eslint-disable */
import {NS} from "./NetscriptDefinitions"

/** @param {NS} ns */
export async function main(ns: NS) {
   try {
    let target  = ns.args[0] as string
    let weaken_result = await ns.weaken( target )
    
    ns.writePort( 1, JSON.stringify({ weaken_result, hostname: target }) )
  
  } catch(err) {throw err}
  
}

