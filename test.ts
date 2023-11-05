/* eslint-disable */

import { NS } from "./NetscriptDefinitions"
import { ServerList } from "./lib_ServerList"

export async function main( ns: NS ) {

  let l = await ServerList.build( ns ) 

  ns.tprint( l )

  let x = 12 ;
}

