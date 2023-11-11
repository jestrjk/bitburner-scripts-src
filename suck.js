/* eslint-disable */
/** @typedef{import("./NetscriptDefinitions").NS} NS */

import {PortManager} from "./suck_lib"

/** @param {NS} ns  */
export async function main(ns) {
  let p = new PortManager(ns)

  p.writeport( {a:1} )
  
  ns.tprint( `count: ${p.count}` )

  ns.print ( `Read ${p.readport()}` )
  
  ns.tprint( `count: ${p.count}` ) 

  ns.print
}