import { NS } from "./NetscriptDefinitions";
import { ServerList } from "./lib/ServerList";
import { data } from "./global_data"

export async function main (ns:NS) {
  let iterations  = <number>ns.args[0] ?? -1
  let iterator    = 0
  while (iterations == -1 || iterations > iterator) {
    
    data.player = ns.getPlayer(),
    data.server_list = new ServerList(ns)
    
    iterator += 1
    await ns.sleep(2000)
  }
}
