/* eslint-disable */
import { NS, Server } from './NetscriptDefinitions'

// interface Server_Data_Extended {
//   grow: any,
//   weaken: any,
//   hack: any,
// }
// type Server_Data_Custom = Server & Server_Data_Extended
// const percent = 1/100;


export async function getAllServersAndNames(ns: NS, host_name = 'home') {
       
  let all_servers : Server[] = []
  let all_server_names : string[] = []
  
  await getAllServers(ns, host_name, all_servers, all_server_names ) // -> this.all_servers, this.all_server_names
  let all_script_host_names = getScriptHostNames( all_server_names )
  return { all_servers, all_server_names, all_script_host_names }
}  
  
async function getAllServers( ns: NS, target_host_name = 'home', all_servers: Server[], all_server_names: string[] ) {

  let new_servers = ns.scan( target_host_name )

  for ( let new_server_name of new_servers ) {
    if ( all_server_names.includes( new_server_name ) ) {
      continue
    } else {
      all_servers.push( ns.getServer( new_server_name ) )
      all_server_names.push( new_server_name ) 
      await getAllServers( ns, new_server_name, all_servers, all_server_names )
    }
  }
}


function getScriptHostNames( all_server_names: string[] ) {
    
  let script_host_names = all_server_names.filter( server_name => (
    server_name == 'home' ||
    server_name.startsWith( 'script-host') )
  )

  return script_host_names
}

  /** @param {NS} ns */
  // private getServerData( target: string ) : Server_Data_Custom {

  //   let data: Server = this.ns.getServer(target)
  //   let max_server_money = this.ns.getServerMaxMoney( target )

  //   let connection = this.ns
  //   return {
  //     ...data,
  //     hack: {
  //       money_from_single_thread:       this.ns.hackAnalyze( target ),
  //       hack_success_chance:            this.ns.hackAnalyzeChance(target),
  //       threads_to_hack_half_max_money: this.ns.hackAnalyzeThreads(target, 50*percent * max_server_money ),
  //       required_level_to_hack:         this.ns.getServerRequiredHackingLevel( target ),
  //     },
  //     weaken: {
  //       security_decrease:        this.ns.weakenAnalyze( 1 /* TODO */, this.host_name.cpuCores ),
  //       time_required:            this.ns.getWeakenTime( target ),
  //     },
  //     grow: {
  //       time_required:            this.ns.getGrowTime( target ), //ms
  //       growth_percentage:        this.ns.getServerGrowth( target ), //percent
  //       growth_security_increase: this.ns.growthAnalyzeSecurity(100, target, this.host_name.cpuCores ), // Security Increase for growing
  //       thread_requirements: {
  //         for150percent : this.ns.growthAnalyze( this.host_name.hostname, 150*percent , this.host_name.cpuCores ),
  //         for200percent : this.ns.growthAnalyze( this.host_name.hostname, 200*percent , this.host_name.cpuCores ),
  //       },
  //     }, 
  //   }
  // } // getServerData
  

function s  ( str: string ) { return str.padEnd( 8 )}
function ms ( str: string ) { return str.padEnd( 12 )}
function m  ( str: string ) { return str.padEnd( 16 )}
function ml ( str: string ) { return str.padEnd( 24 )}
function l  ( str: string ) { return str.padEnd( 32 )}
  
