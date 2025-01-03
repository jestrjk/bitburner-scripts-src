import { getData } from "../global_data/GlobalData"

let data = getData()

export async function main ( ns:NS ) {
  ns.tail() 
  
  let weaken_script_name = 'scripts/hack/lite_weaken.ts'
  let valid_hack_targets = data.server_targets.getValidHackTargets() 

  ns.print( `Valid Hack Targets: ${valid_hack_targets.length}` )
  ns.print( `${valid_hack_targets.map( s => s.hostname )}` )

  while (true) {
    for ( let serverData of valid_hack_targets ) {
        let script_host = 'home'

        if ( serverData.server.hackDifficulty! < serverData.server.minDifficulty! ) {
          ns.print( `[${serverData.hostname}] NO WEAKEN - hackDifficulty: ${serverData.server.hackDifficulty}` ) ; 
          continue;
        }

        let weaken_scripts = ns.ps( script_host )

        ns.print( `[${serverData.hostname}] weaken_scripts: ${weaken_scripts.length}` )
        
        if ( weaken_scripts.find( p => 
          (p.filename == weaken_script_name) && 
          (p.args[0] == serverData.hostname) ) ){

            ns.print( `[${serverData.hostname}] '${weaken_script_name}' already running on [${script_host}]` );
          continue;
        }
        
        let weakenTime = ns.getWeakenTime( serverData.hostname )
        let difficulty_difference = serverData.server.hackDifficulty! - serverData.server.minDifficulty!
        let weaken_threads = Math.min( 100, Math.floor( difficulty_difference / 0.05 ) ) 

        let weaken_trigger = 20
        if ( weaken_threads < weaken_trigger ) {
          ns.print( `[${serverData.hostname}] NO WEAKEN - weaken_threads: ${weaken_threads}/${weaken_trigger}` ) ; 
          continue; 
        }
        
        data.server_actions.push( { 
          timestamp: Date.now(), 
          hostname: serverData.hostname,
          expires: Date.now() + weakenTime, 
          description: 'W', // weaken
        } )

        ns.print( `[${serverData.hostname}] ${weakenTime}ms to weaken @ ${Date.now()}` )

        ns.exec( weaken_script_name, script_host, weaken_threads, serverData.hostname )
      }
      await ns.sleep(1000);
  }
} 