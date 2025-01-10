import { data, getValidHackTargets } from "../global_data/GlobalData"
import { getBestScriptHost } from "../global_data/GlobalData"

const hack_script_name = 'scripts/hack/lite_hack.ts'

export async function main ( ns:NS ) {
  ns.tail() 
 

  while (true ) {
    ns.clearLog()
    let time_start = Date.now()

    let sorted_servers = getValidHackTargets().sort( (s1,s2) => s2.hackEfficiency - s1.hackEfficiency) 
    for ( let serverData of sorted_servers ) {
      
      let targetServer = serverData.server
      if ( ! serverIsValidTarget( targetServer ).valid ) continue ;
            
      let hack_threads = Math.min(1000, Math.floor(ns.hackAnalyzeThreads(serverData.hostname, targetServer.moneyAvailable! * 0.35)))
      let hack_time = ns.getHackTime(serverData.hostname)

      if ( targetServer.moneyAvailable! < (targetServer.moneyMax! * 0.9) ) {
        ns.print( `[${serverData.hostname}] Money too low: ` + 
          `${Math.floor(targetServer.moneyAvailable!/1000)}k/${Math.floor(targetServer.moneyMax!/1000)}k` )
        continue;
      }
            
      let script_host = getBestScriptHost( ns, hack_script_name)
      if ( !script_host ) {
        ns.print( `[${serverData.hostname}] No Script Host` ) ; 
        continue ;
      }
     
      let hack_scripts = ns.ps( script_host.hostname )
      
      if ( hack_scripts.find( p => 
        (p.filename == hack_script_name) && 
        (p.args[0] == serverData.hostname) ) ){

          ns.print( `[${serverData.hostname}] '${hack_script_name}' already running` );
        continue;
      }
      
      if ( targetServer.hackDifficulty! > targetServer.minDifficulty! + 5 ) {
        ns.print( `[${serverData.hostname}] Security too high: ${targetServer.hackDifficulty} > ${targetServer.minDifficulty! + 5}` )
        continue;
      }
      
      let pid = ns.exec( hack_script_name, script_host.hostname, hack_threads, serverData.hostname )

      if ( pid ) {
        data.server.actions.push( { 
          timestamp: Date.now(), 
          threads: hack_threads,
          hostname: serverData.hostname,
          expires: Date.now() + hack_time, 
          description: 'H',
          script_host: script_host.hostname,
        } )
      }
    }
    
    ns.print( `HACK Script Main Loop: ${Date.now() - time_start}` )
    await ns.sleep( 1000 ) 
  }
}

function serverIsValidTarget( server: Server ) {

  if ( !server.hasAdminRights ) {
    return { 
      valid: false,
      message: `[${server.hostname}] No Admin Rights`,
    }
  }

  if ( server.purchasedByPlayer == true ) {
    return {
      valid: false,
      message: `[${server.hostname}] Purchased By Player`,
    }
  }

  if ( server.moneyMax! <= 0 ) {
    return {
      valid: false,
      message: `[${server.hostname}] No Money in it`,
    }
  }

  return { valid: true, message: "Valid Grow Target" }
}
