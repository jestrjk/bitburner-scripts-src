import { data, getValidHackTargets, getScriptHosts, getBestScriptHost } from "../global_data/GlobalData"
import { LiteScriptNames } from "../global_data/ServerData"

export async function main ( ns:NS ) {
  ns.tail() 
  
  let weaken_script_name = 'scripts/hack/lite_weaken.ts'
  
  while (true) {
    ns.clearLog()
    
    for ( let server_data of getValidHackTargets() ) {

      if ( server_data.isBeingManipulatedBy( ns, getScriptHosts(), LiteScriptNames.WEAKEN ) ) {
        ns.print( `[${server_data.hostname}] already weakeneding - skipping` );
        continue;
      }

      let script_host = getBestScriptHost( ns.getScriptRam(weaken_script_name) )

      if ( !script_host ) { 
        ns.print( `[${server_data.hostname}] No Script Host - skipping` ) ;
        continue;
      }
      
      if ( server_data.difficultyDelta < 1 ){
        ns.print( `[${server_data.hostname}] low difficulty delta: ${server_data.difficultyDelta} - skipping` ) ; 
        continue;
      }
      
      let weaken_threads = Math.min( 100, Math.floor( server_data.difficultyDelta / 0.05 ) ) 
      let weakenTime = ns.getWeakenTime( server_data.hostname )
      ns.print( `[${server_data.hostname}] ${weakenTime}ms to weaken @ ${new Date().toISOString()}` )
      
      let pid = ns.exec( weaken_script_name, script_host.hostname, weaken_threads, server_data.hostname )
      if ( pid ) {
        data.server.actions.push( { 
          timestamp: Date.now(), 
          hostname: server_data.hostname,
          expires: Date.now() + weakenTime, 
          description: 'W', // weaken
          script_host: script_host.hostname
        } )
      }

    }
    ns.print( new Date().toISOString() )
    await ns.sleep(10000);
  }
} 