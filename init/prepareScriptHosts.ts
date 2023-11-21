import { NS } from "../NetscriptDefinitions";
import { ServerList } from "../lib/ServerList";

export async function main(ns:NS) {
  ns.tail() 
  
  let sl = new ServerList(ns)

  while(true) {
    for( let server of sl.all_servers ) {
      installScripts(ns, server.hostname)
      await ns.sleep(50)
    }
    await ns.sleep( 10000 )
  }
}

function installScripts( ns: NS,script_host_name: string ) {
	let script_names_to_scp = ns.ls('home', ".js")
	ns.scp( script_names_to_scp, script_host_name, 'home' )
}