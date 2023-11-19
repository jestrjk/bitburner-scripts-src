/* eslint-disable */
import { NS, Server } from '../NetscriptDefinitions'

export function getAllServers(ns:NS) : Server[] {
  let all_servers : Server[] = []
  recursiveServerScan(ns, 'home', all_servers)
  return all_servers
}

function recursiveServerScan(ns: NS, parent_host_name = 'home', all_servers: Server[]): void {
  let new_server_names = ns.scan( parent_host_name )

  for ( let new_server_name of new_server_names ) {
    if ( all_servers.filter( s=>s.hostname == new_server_name ).length > 0) {
      continue;
    } else {
      all_servers.push( ns.getServer( new_server_name ) )
      recursiveServerScan( ns, new_server_name, all_servers )
    }
  }
}

export function getUtilityHosts( ns:NS, all_servers: Server[] ) {
  let utility_hosts:Server[] = []

  utility_hosts = all_servers.filter(s=>s.purchasedByPlayer && s.hostname.startsWith("utility-scripts"))

  return utility_hosts;
}

export function getScriptHosts(ns:NS, all_servers: Server[]) {
  let script_hosts:Server[] = []

  // we are pushing the result of a Server[] returning function
  // but deconstructing it first into Server,Server,Server with the
  // ... operator. push accepts deconstructed individual pushed objects, but
  // not just an array of the desired content. /shrug
  script_hosts = all_servers.filter((s=>s.purchasedByPlayer && !s.hostname.startsWith( "utility-scripts")))

  return script_hosts
}
  
