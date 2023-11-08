/* eslint-disable */
import {NS} from "./NetscriptDefinitions"

/** @param {NS} ns */
export async function main(ns : NS) {
  try {
    let target: string  = ns.args[0] as string
    let hack_result = await ns.hack( target )
    
    ns.writePort( 1, JSON.stringify( { hack_result, hostname: target } ) )

  } catch(err) {throw err}
  
}

