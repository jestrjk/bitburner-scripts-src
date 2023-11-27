import {NS} from "../NetscriptDefinitions"

export async function main(ns:NS) {
  ns.tail() 

  let singularity_hack_manual_script_name = "singularity/hackManual.js"

  let script_host_maxram = ns.getServer().maxRam?? 0
  let hack_manual_mem_required = ns.getScriptRam(singularity_hack_manual_script_name)
  if ( hack_manual_mem_required === 0 ) throw `ns.getScriptRam() could not find ${singularity_hack_manual_script_name}`
  
  let hack_manual_threads = 0
  hack_manual_threads = Math.floor( script_host_maxram * .40 / hack_manual_mem_required )
  ns.print( `${ns.getHostname()} with maxram ${script_host_maxram} requires ${hack_manual_mem_required} for -t ${hack_manual_threads}`)

  if ( hack_manual_threads === 0 ) throw "ERROR Cant computer the number of threads"

  //if ( hack_manual_threads !== 0 ) hack_manual_threads = <number>ns.args[0] 
  
  let scripts = [
    { name: "global_data/populate_data.js", threads: 1 },
    { name: "init/prepareScriptHosts.js",   threads: 1 },
    
    { name: "dashboard/server_stats.js",    threads: 1 },
    { name: "dashboard/process_watcher.js", threads: 1 },
    { name: "dashboard/money_perSecond.js", threads: 1 },
    
    { name: "singularity/hackManual.js",    threads: hack_manual_threads },
    { name: "hack/install.js",              threads: 1 },
  ]

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
  await ns.sleep( 2000 ) 
  ns.closeTail()
}