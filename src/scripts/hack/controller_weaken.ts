import { HackableServer } from "./HackableServer"
import { getData } from "../global_data/GlobalData"

let data = getData()

export async function main ( ns:NS ) {
  ns.tail() 
  
  let weaken_script_name = 'scripts/hack/weaken.ts'
  let valid_hack_targets = data.server_targets.getValidHackTargets() 

  ns.print( `Valid Hack Targets: ${valid_hack_targets.length}` )
  ns.print( `${valid_hack_targets.map( s => s.hostname )}` )

  for ( let serverData of valid_hack_targets ) {
      let weaken_scripts = ns.ps( serverData.hostname )
      
      ns.print( `[${serverData.hostname}] weaken_scripts: ${weaken_scripts.length}` )
      
      for ( let weaken_script of weaken_scripts ) {
        ns.print( `PS: ${weaken_script}` )
      }

      if ( weaken_scripts.find( p => 
        (p.filename == weaken_script_name) && 
        (p.args[0] == serverData.hostname) ) ){

          ns.print( `[${serverData.hostname}] '${weaken_script_name}' already running` );
        continue;
      }
      
      let weakenTime = ns.getWeakenTime( serverData.hostname )
      
      data.server_actions.push( { 
        timestamp: Date.now(), 
        hostname: serverData.hostname,
        expires: Date.now() + weakenTime, 
        description: 'W', // weaken
      } )

      ns.print( `[${serverData.hostname}] ${weakenTime}ms to weaken @ ${Date.now()}` )

      ns.exec( weaken_script_name, 'home', 20, serverData.hostname )
    }
} 