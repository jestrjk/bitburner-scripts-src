import { CustomServerData } from "./CustomServerData"

export interface ProcessInfoPlus extends ProcessInfo {
  script_host: string  
}

export class CustomServerDataList {
  constructor(ns:NS){
    this.ns = ns
    
    this.recursiveServerScan('home')
    ns.print( `Found ${this.all_servers.length} servers` )
  }
    
  private ns:NS
  all_servers: CustomServerData[] = []
  all_hack_processes: ProcessInfoPlus[] = []

  getScriptHosts() {
    return this.all_servers.filter(s=>s.server.purchasedByPlayer )
  }

  getBestScriptHost( required_ram: number ) {
    for( let script_host of this.getScriptHosts() ) {
      let available_ram = script_host.server.maxRam - script_host.server.ramUsed

      if ( available_ram > required_ram ) {
        return script_host
      }
    } 

    return null

  }
  hostIsBeingHackedBy( target_host_name:string, script_name: string ) {
    this.ns.print( `Checking if ${script_name} running on ${target_host_name}`)
    for( let script_host of this.getScriptHosts() ) {
      let lite_scripts_running = this.ns.ps( script_host.hostname ).filter( 
        p => p.filename.includes(script_name) &&
        p.args[0] === target_host_name
      )

      if ( lite_scripts_running.length > 0 ) {
        this.ns.print( `Found ${target_host_name} ${script_name} scripts running on ${script_host.hostname}` )

        return true
      }

    }

    return false 
  }

  hostIsBeingWeakened( hostname:string, script_name: string = 'lite_weaken.ts' ) {
   return this.hostIsBeingHackedBy( hostname, script_name )
  }

  hostIsBeingGrown( hostname:string, script_name: string = 'lite_grow.ts' ) {
    return this.hostIsBeingHackedBy( hostname, script_name )
  }

  hostIsBeingHacked( hostname:string, script_name: string = 'lite_hack.ts' ) {
    return this.hostIsBeingHackedBy( hostname, script_name )
  }   
  
  getValidHackTargets() {
    let hack_targets =  this.all_servers.filter( s =>
      ( s.server.hasAdminRights ) && 
      ( s.server.moneyMax! > 0 )
    )

    if ( hack_targets && hack_targets.length > 1 ) {
      return hack_targets
    } else {
      throw( `No valid hack targets` )
    }
  }

  private recursiveServerScan(parent_host_name = 'home'): void {
    let new_server_names = this.ns.scan( parent_host_name )
  
    for ( let new_server_name of new_server_names ) {
      if ( this.all_servers.filter( s=>s.hostname == new_server_name ).length > 0) {
        continue;
      } else {
        let new_server = new CustomServerData( this.ns,  new_server_name )
        this.all_servers.push( new_server )

        this.recursiveServerScan( new_server_name )
      }
    }
  }

}
