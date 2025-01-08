import { getData } from "../global_data/GlobalData"

let data = getData() 

const hack_script_name = 'scripts/hack/lite_hack.ts'

export async function main ( ns:NS ) {
  ns.tail() 
 

  while (true ) {
    ns.clearLog()
    let time_start = Date.now()

    for ( let serverData of data.server_targets!.all_servers ) {
      
      let targetServer = serverData.server
      if ( ! serverIsValidTarget( targetServer ).valid ) continue ;
            
      let hack_threads = Math.min(500, Math.floor(ns.hackAnalyzeThreads(serverData.hostname, targetServer.moneyAvailable! * 0.25)))
      let hack_time = ns.getHackTime(serverData.hostname)

      if ( targetServer.moneyAvailable! < (targetServer.moneyMax! * 0.9) ) {
        ns.print( `[${serverData.hostname}] Money too low: ${Math.floor(targetServer.moneyAvailable!/1000)}k/${Math.floor(targetServer.moneyMax!/1000)}k` )
        continue;
      }
            
      let script_host = getBestScriptHost(ns, ns.getScriptRam(hack_script_name))
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
        data.server_actions.push( { 
          timestamp: Date.now(), 
          hostname: serverData.hostname,
          expires: Date.now() + hack_time, 
          description: 'H',
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

function getBestScriptHost( ns:NS, required_ram: number ) {
  for( let script_host of data.server_targets.getScriptHosts() ) {
    let available_ram = script_host.server.maxRam - script_host.server.ramUsed

    if ( available_ram > required_ram ) {
      ns.print( `[${script_host.hostname}] has ${available_ram}gb for ${required_ram}gb script`)

      return script_host
    }
  } 

  return null 
}