import { data, getValidHackTargets, getScriptHosts, getBestScriptHost } from "../global_data/GlobalData"
import { LiteScriptNames } from "../global_data/ServerData"

export async function main ( ns:NS ) {
  ns.tail() 
  
  let weaken_script_name = 'scripts/hack/lite_weaken.ts'
  
  while (true) {
    ns.clearLog()

    let valid_hack_targets = getValidHackTargets()
    for ( let server_data of valid_hack_targets ) {
      ns.print( `[${server_data.hostname}]` )
      
      if ( server_data.isBeingManipulatedBy( ns, getScriptHosts(), LiteScriptNames.WEAKEN ) ) {
        ns.print( `[${server_data.hostname}] already weakening - skipping` );
        continue;
      }
      
      if ( server_data.difficultyDelta < 1 ){
        ns.print( `[${server_data.hostname}] low difficulty delta: ${server_data.difficultyDelta} - skipping` ) ; 
        continue;
      }
      
      let weaken_threads = Math.min( 1000, Math.floor( server_data.difficultyDelta / 0.05 ) ) 

      let script_host = getBestScriptHost( ns, weaken_script_name, weaken_threads )

      if ( !script_host ) { 
        ns.print( `[${server_data.hostname}] No Script Host - skipping` ) ;
        continue;
      }

      let weakenTime = ns.getWeakenTime( server_data.hostname )
      ns.print( `[${server_data.hostname}] ${weakenTime}ms to weaken @ ${new Date().toISOString()}` )
      
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