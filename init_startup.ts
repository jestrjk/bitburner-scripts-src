import {NS} from "./NetscriptDefinitions"

let scripts = [
  "dashboard/server_stats.js",
  "dashboard/process_watcher.js",
  "dashboard/PortManager_Statistics.js",
  "dashboard/liteScript_Statistics.js",
  "dashboard/money_perSecond.js",
  "hack/install.js"
]

export async function main(ns:NS) {
  let procs = ns.ps()
  for( let script of scripts ) {
    let filtered_procs = procs.filter(p=>p.filename == script)
    
    ns.tprint( JSON.stringify( filtered_procs, null, 1))
    
    for( let filtered_proc of filtered_procs) {
      ns.closeTail( filtered_proc.pid)
      await ns.sleep(100)
      ns.kill( filtered_proc.pid )
    }

    ns.run(script)
    await ns.sleep(250)
  }
}