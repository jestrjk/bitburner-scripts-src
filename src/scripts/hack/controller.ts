import { data, getValidHackTargets, getScriptHosts, getBestScriptHost } from "../global_data/GlobalData"
import { LiteScriptNames, ServerData } from "../global_data/ServerData"

export async function main ( ns:NS ) {
  ns.tail() 
  
  let weaken_script_name = 'scripts/hack/lite_weaken.ts'
  
  while (true) {
    ns.clearLog()

    let valid_hack_targets = getValidHackTargets()
    for ( let server_data of valid_hack_targets ) {
      ns.print( `[${server_data.hostname}]` )
      
      
      let pid = ns.exec( weaken_script_name, script_host.hostname, weaken_threads, server_data.hostname )
      if ( pid ) {
        data.server.actions.push( { 
          timestamp: Date.now(), 
          threads: weaken_threads,
          hostname: server_data.hostname,
          expires: Date.now() + weakenTime, 
          description: 'W', // weaken
          script_host: script_host.hostname
        } )
      }

    }
    ns.print( new Date().toISOString() )
    await ns.sleep(1000);
  }
} 

interface ServerDataAnalysis {
  hasRunningScripts: boolean
  running_scripts_data: ProcessInfo[]
  
}

function controllerWeaken( ns:NS, target_server_data:ServerData ) {
 
  if ( target_server_data.analysis_data.processes.some( p => p.filename.includes(LiteScriptNames.WEAKEN)) ) {
    ns.print( `[${target_server_data.hostname}] already weakening - skipping` );
    return false
  }

  if ( target_server_data.difficultyDelta < 1 ){
    ns.print( `[${target_server_data.hostname}] does not need weakened: difficulty delta: ${target_server_data.difficultyDelta} - skipping` ) ; 
    return false
  }
  
  let weaken_threads = Math.min( 1000, Math.floor( target_server_data.difficultyDelta / 0.05 ) ) 

  let script_host = getBestScriptHost( ns, LiteScriptNames.WEAKEN, weaken_threads )

  if ( !script_host ) { 
    ns.print( `[${target_server_data.hostname}] No Script Host - skipping` ) ;
  }

  let weakenTime = ns.getWeakenTime( target_server_data.hostname )
  ns.print( `[${target_server_data.hostname}] ${weakenTime}ms to weaken @ ${new Date().toISOString()}` )

}