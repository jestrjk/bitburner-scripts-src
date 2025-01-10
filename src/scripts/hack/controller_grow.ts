import { data } from "../global_data/GlobalData"
import { getBestScriptHost, getValidHackTargets } from "../global_data/GlobalData"

const growth_script_name = 'scripts/hack/lite_grow.ts'

export async function main ( ns:NS ) {
  ns.tail() 
 

  while (true ) {
    ns.clearLog()
    let time_start = Date.now()


    let sorted_servers = getValidHackTargets().sort( (s1,s2) => s2.hackEfficiency - s1.hackEfficiency) 
    for ( let serverData of sorted_servers ) {

      let targetServer = serverData.server
      let growth_threads = Math.min ( 1000, Math.floor(getGrowthThreads( ns, targetServer )))
      let growth_time    = ns.getGrowTime( serverData.hostname )
      
      if ( ! serverIsValidTarget( targetServer ).valid ) continue ;

      let script_host = getBestScriptHost( ns, growth_script_name)
      if ( !script_host ) {
        ns.print( `[${serverData.hostname}] No Script Host` ) ; 
        continue ;
      }

      if ( targetServer.hackDifficulty! > targetServer.minDifficulty! + 5 ) {
        ns.print( `[${serverData.hostname}] Security too high: ${targetServer.hackDifficulty} > ${targetServer.minDifficulty! + 5}` )
        continue;
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
        data.server.actions.push( { 
          timestamp: Date.now(), 
          threads: growth_threads,
          hostname: serverData.hostname,
          expires: Date.now() + growth_time, 
          description: 'G',
          script_host: script_host.hostname,
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

  ns.print( `[${target_host.hostname}] Growth Threads: ${growth_threads}` )
  
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

