/* eslint-disable */

import { NS } from "./NetscriptDefinitions"
import { ServerList } from "./lib_ServerList"

export async function main( ns: NS ) {

  let l = new ServerList(ns, 'home' )

  ns.tprint( l.all_server_names )

  let x = 12 ;
}

