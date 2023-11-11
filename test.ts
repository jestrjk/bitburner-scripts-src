/* eslint-disable */

import { NS } from "./NetscriptDefinitions"
import { testPort } from "./lib_utils"

export async function main( ns: NS ) {
  ns.tail()
  ns.clearLog()
  ns.clearPort( 1 )

  await testPort(ns, {your: "shit", strinks: true})

  let blah = {
    method1: () => {console.log(1)},
    method2: () => {console.log(2)},
    prop1: 100,
  }
  
  blah.method1()
  blah["prop1"]



}


