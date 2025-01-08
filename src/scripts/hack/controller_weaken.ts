import { GlobalData} from "../global_data/GlobalData"


export async function main ( ns:NS ) {
  ns.tail() 
  
  let data = new GlobalData(ns)

  let weaken_script_name = 'scripts/hack/lite_weaken.ts'
  
  while (true) {
       
    for ( let server_data of data.server_targets!.getValidHackTargets() ) {

      if ( data.server_targets!.hostIsBeingWeakened(server_data.hostname) ) {
        ns.print( `[${server_data.hostname}] already weakeneding - skipping` );
        continue;
      }

      let script_host = data.server_targets!.getBestScriptHost( ns.getScriptRam(weaken_script_name) )

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
      await ns.print( `[${server_data.hostname}] ${weakenTime}ms to weaken @ ${new Date().toISOString()}` )
      
      let pid = await ns.exec( weaken_script_name, script_host.hostname, weaken_threads, server_data.hostname )
      if ( pid ) {
        data.server_actions!.push( { 
          timestamp: Date.now(), 
          hostname: server_data.hostname,
          expires: Date.now() + weakenTime, 
          description: 'W', // weaken
          script_host: script_host.hostname
        } )
      }

    }
    ns.print( new Date().toISOString())
    await ns.sleep(10000);
  }
} 