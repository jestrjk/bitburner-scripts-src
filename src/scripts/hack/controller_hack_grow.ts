import { getData } from "../global_data/GlobalData"

let data = getData() 

const growth_script_name = 'scripts/hack/lite_grow.ts'

export async function main ( ns:NS ) {
  ns.tail() 
 

  while (true ) {
    ns.clearLog()
    let time_start = Date.now()

    for ( let serverData of data.server_targets!.all_servers ) {
      let targetServer = serverData.server
      let growth_threads = Math.min ( 500, Math.floor(getGrowthThreads( ns, targetServer )))
      let growth_time    = ns.getGrowTime( serverData.hostname )
      
      if ( ! serverIsValidTarget( targetServer ).valid ) continue ;

      let script_host = getBestScriptHost(ns, ns.getScriptRam(growth_script_name))
      if ( !script_host ) {
        ns.print( `[${serverData.hostname}] No Script Host` ) ; 
        continue ;
      }

      if ( growth_time > 60000 ) {
        ns.print( `[${serverData.hostname}] Growth time too long: ${Math.floor( growth_time/1000 )}s` )
        continue ;
      }

      let growth_scripts = ns.ps( script_host.hostname )
      
      if ( growth_scripts.find( p => 
        (p.filename == growth_script_name) && 
        (p.args[0] == serverData.hostname) ) ){

          ns.print( `[${serverData.hostname}] '${growth_script_name}' already running` );
        continue;
      }
      
      if ( growth_threads <= 1 ) {
        ns.print( `[${serverData.hostname}] No Growth: grow_threads: ${growth_threads}` )
        continue ;
      }

      let pid = ns.exec( growth_script_name, script_host.hostname, growth_threads, serverData.hostname )

      if ( pid ) {
        data.server_actions.push( { 
          timestamp: Date.now(), 
          hostname: serverData.hostname,
          expires: Date.now() + growth_time, 
          description: 'G',
        } )
      }
    }
    
    ns.print( `Script Main Loop: ${Date.now() - time_start}` )
    await ns.sleep( 1000 ) 
  }
}

function getGrowthThreads ( ns:NS, target_host:Server) {
  if ( !target_host.moneyMax || !target_host.moneyAvailable ) return 0;

  let money_ratio = target_host.moneyMax! / target_host.moneyAvailable!
  let growth_threads = ns.growthAnalyze(target_host.hostname, money_ratio )

  ns.print( `[${target_host.hostname}] growth_threads: ${growth_threads}` )
  return growth_threads
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