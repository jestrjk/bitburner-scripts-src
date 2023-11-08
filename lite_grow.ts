/* eslint-disable */
import {NS} from "./NetscriptDefinitions"

/** @param {NS} ns */
export async function main(ns: NS) {
  try {
    let target  = ns.args[0] as string
    let grow_result = await ns.grow( target ) 

    ns.writePort( 1, JSON.stringify( {grow_result, hostname: target } ) )

  } catch(err) {throw err}
}

