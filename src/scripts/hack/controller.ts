import { data } from "../global_data/GlobalData"

export async function main ( ns:NS ) {
  ns.tail() 
  
  for ( let server of data.server_targets!.all_servers ) {
    let { validHackTarget, message } = serverIsValidHackTarget( server )

    if ( !validHackTarget ) {
      //ns.print( message ) 
      continue;
    }

    ns.print( `Hacking ${server.hostname}`)
    await tryWeaken( ns, server )
  }
} 

function serverIsValidHackTarget( server: Server ) {

  if ( !server.hasAdminRights ) {
    return { 
      validHackTarget: false,
      message: `[${server.hostname}] No Admin Rights`,
    }
  }

  if ( server.purchasedByPlayer == true ) {
    return {
      validHackTarget: false,
      message: `[${server.hostname}] Purchased By Player`,
    }
  }

  if ( server.moneyMax! <= 0 ) {
    return {
      validHackTarget: false,
      message: `[${server.hostname}] No Money in it`,
    }
  }

  return { validHackTarget: true, message: "Valid Hack Target" }
}

async function tryWeaken(ns: NS, server: Server) {
  let script_host = getBestScriptHost( ns, script_hosts, 10 /* 10GB */ )

  if ( script_host ) {
    broker.data.server_diffs.push({
      timestamp: Date.now(),
      hostname: server.hostname,
      diff_summary: "weaken",
      time_to_live: ns.getWeakenTime(server.hostname),
    })

    let pid= ns.exec( 'scripts/hack/weaken.ts', script_host.hostname, 10 /* Fix */, server.hostname )
  } else {
    ns.print( `[${server.hostname}] No Script Host Found` )
  }
  
}

function getBestScriptHost( ns:NS, script_hosts: Server[], required_ram: number ) {
  for( let script_host of script_hosts ) {
    let available_ram = script_host.maxRam - script_host.ramUsed

    ns.print( `\{${script_host.hostname}\} only has ${available_ram} `)

    if ( available_ram > required_ram ) {
      return script_host
    }
  } 

  return null 
}