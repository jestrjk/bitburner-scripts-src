import { ServerTarget } from "./ServerTarget"

export class ServerTargetList {
  constructor(ns:NS){
    this.ns = ns
    
    this.recursiveServerScan('home')
    ns.print( `Found ${this.all_servers.length} servers` )
  }
  
  private ns:NS
  all_servers: ServerTarget[] = []

  getScriptHosts() {
    return this.all_servers.filter(s=>s.server.purchasedByPlayer )
  }

  getValidHackTargets() {
    return this.all_servers.filter( s =>
      ( s.server.hasAdminRights ) && 
      ( s.server.moneyMax! > 0 )
    )
  }

  private recursiveServerScan(parent_host_name = 'home'): void {
    let new_server_names = this.ns.scan( parent_host_name )
  
    for ( let new_server_name of new_server_names ) {
      if ( this.all_servers.filter( s=>s.hostname == new_server_name ).length > 0) {
        continue;
      } else {
        this.all_servers.push( new ServerTarget( this.ns,  new_server_name ) )
        this.recursiveServerScan( new_server_name )
      }
    }
  }

}
