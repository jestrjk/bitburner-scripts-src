import {NS} from "../NetscriptDefinitions"

let scripts = [
  { name: "global_data/populate_data.js", threads: 1 },
  { name: "init/prepareScriptHosts.js",   threads: 1 },
  
  { name: "dashboard/server_stats.js",    threads: 1 },
  { name: "dashboard/process_watcher.js", threads: 1 },
  { name: "dashboard/money_perSecond.js", threads: 1 },
  
  { name: "singularity/hackManual.js",    threads: 50 },
  { name: "hack/install.js",              threads: 1 },
]

export async function main(ns:NS) {
  let procs = ns.ps()
  for( let script of scripts ) {
    let filtered_procs = procs.filter(p=>p.filename == script.name)
    
    ns.tprint( JSON.stringify( filtered_procs, null, 1))
    
    for( let filtered_proc of filtered_procs) {
      ns.closeTail( filtered_proc.pid)
      await ns.sleep(100)
      ns.kill( filtered_proc.pid )
    }

    ns.run(script.name, script.threads)
    await ns.sleep(1000)
  }
}