import { NS, Server } from "../NetscriptDefinitions";
import { ServerList } from "../lib/ServerList";
import { RootKit } from "../lib/RooKit";
import { colors } from "../lib/utils";

export async function main(ns:NS) {
  ns.tail() 
  
  let sl = new ServerList(ns)

  while(true) {
    for( let server of sl.all_servers ) {
      installScripts(ns, server.hostname)
      root_server(ns,server)
      await ns.sleep(50)
    }
    await ns.sleep( 10000 )
  }
} // main()

function installScripts( ns: NS,script_host_name: string ) {
	let script_names_to_scp = ns.ls('home', ".js")
	ns.scp( script_names_to_scp, script_host_name, 'home' )
}
function root_server( ns:NS, target_server: Server ) {
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