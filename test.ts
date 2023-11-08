/* eslint-disable */

import { NS } from "./NetscriptDefinitions"
import { testPort } from "./lib_utils"

export async function main( ns: NS ) {
  ns.tail()
  ns.clearLog()
  ns.clearPort( 1 )

  await testPort(ns, {your: "shit", strinks: true})
}

