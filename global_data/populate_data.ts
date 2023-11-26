import { NS } from "../NetscriptDefinitions";
import { ServerList } from "../lib/ServerList";
import { data } from "./data"

export async function main (ns:NS) {
  ns.tail() 
  ns.disableLog( "scan")

  let iterations  = <number>ns.args[0] ?? -1
  let iterator    = 0
  while (iterations == -1 || iterations > iterator) {
    ns.print( `Refreshing Global Data`)

    data.player = ns.getPlayer(),
    data.server_list = new ServerList(ns)
    data.server_analysis = {}
    data.singularity = { current_server: ns.singularity.getCurrentServer() }

    for( let server of data.server_list.all_servers) {
        data.server_analysis![server.hostname] = {
          hostname:                   server.hostname,
          hack_time_required:         ns.getHackTime(server.hostname),
          hack_money_ratio_stolen:    ns.hackAnalyze(server.hostname),
          hack_threads_for_75percent: ns.hackAnalyzeThreads(server.hostname, (server.moneyMax??0)*.75),
          hack_success_chance:        ns.hackAnalyzeChance(server.hostname),
          growthAnalyzeData:          ns.growthAnalyze( server.hostname, 2 ),
          weakenAnalyseData:          ns.weakenAnalyze( 1 ),
          grow_time_required:         ns.getGrowTime( server.hostname ),
          
        }
    }
    
    iterator += 1
    await ns.sleep(2000)
  }
}
