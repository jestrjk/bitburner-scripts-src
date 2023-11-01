/* eslint-disable */
import {NS} from "./NetscriptDefinitions"

/** @param {NS} ns */
export async function main(ns) {

  let target  = ns.args[0] 
  try {
    await ns.weaken( target )
  } catch( err ) {
    ns.tprint( err ) 
  }
  
}

