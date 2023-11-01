/* eslint-disable */
import {NS} from "./NetscriptDefinitions"
import {ServerList} from "./lib_ServerList"

export class ScriptHosts {
  script_host_names: string[]

  constructor(ns: NS) {
    let server_list = new ServerList(ns)
    
    this.script_host_names = server_list.all_server_names.filter( server_name => (
      server_name == 'home' ||
      server_name.startsWith( 'script-host') )
    )
  }
}