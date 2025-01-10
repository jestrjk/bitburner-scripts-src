import { data, getScriptHosts } from "../global_data/GlobalData";
import { ServerData } from "../global_data/ServerData";
import { RootKit } from "../lib/RooKit";
import { colors } from "../lib/utils";

export async function main(ns:NS) {
  ns.tail() 
  ns.moveTail(1700, 990)
  ns.disableLog( "scp" )
  ns.disableLog( "brutessh")
  ns.disableLog( "ftpcrack")
  ns.disableLog( "relaysmtp")
  ns.disableLog( "httpworm")
  ns.disableLog( "sqlinject")

  while(true) {
    
    for( let server of data.server.data) {
      root_server(ns,server)
    }
    
    for( let server of getScriptHosts() ) {
      installScripts(ns, server)
    }

    await ns.sleep( 5000 )
  }
} // main()

function installScripts( ns: NS, scriptHostTarget: ServerData ) {
  let script_host = scriptHostTarget.server

  if ( script_host.hasAdminRights) {
    let script_names_to_scp = ns.ls('home', ".ts")
    if ( ns.scp( script_names_to_scp, script_host.hostname, 'home' ) ) {
      ns.print(`${colors.brightGreen}Success SCP ${script_host.hostname}`) 
    } else {
      ns.print( `ERROR Failed to scp to script_host.hostname`)
    }
  }
}

function root_server( ns:NS, serverData: ServerData ) {
  let target_server = serverData.server

  if ( target_server.hasAdminRights ) { return true } else {
    let root_kit = new RootKit(ns, target_server ) 
    let rooted = root_kit.run()
    ns.print( `[${target_server.hostname}] rooted: ${rooted}` )
    target_server = ns.getServer(target_server.hostname)
    
    if ( target_server.hasAdminRights ) { return true } else {
      console.log ( `${colors.brightRed} skipping ${target_server.hostname} - could not root kit it`)
      return false
    } 
  }
  //no reach
}