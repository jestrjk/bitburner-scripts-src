/* eslint-disable */
import { NS, Server } from "./NetscriptDefinitions"

interface Server_Data_Extended {
  grow: any,
  weaken: any,
  hack: any,
}
type Server_Data_Custom = Server & Server_Data_Extended

const percent = 1/100;

/**
 * A class to generate and hold all the servers in this city and their characteristics.
 */

interface serverMapNode {
  server: Server,
  connections: serverMapNode[],
}

export class ServerList {
  
  ns: NS
  server_map: serverMapNode[] = []
  all_server_names: string[] = []
  all_servers: Server[] = []
  host: Server

  /**
   * ctor
   * 
   * @param {NS} ns the Netscript library
   * @param {string} host_name the name of the host we are running scripts on.
   */
  constructor( ns: NS, host_name : string = 'home' ) {
    this.ns = ns

    this.host = this.ns.getServer( host_name )
    this.getAllServerNames()

    this.all_servers = this.all_server_names.map( (server_name) =>  this.getServerData(server_name) )
  }

  /**
   * gets the server names
   * 
   * @param {string} target The target to start the scan from
   */
  getAllServerNames( target = 'home', map_node: Partial<serverMapNode> = {} ) {

    let new_servers = this.ns.scan( target )

    for ( let new_server of new_servers ) {
      if ( this.all_server_names.includes( new_server ) ) {
        continue
      } else {
        this.all_server_names.push(new_server) 
        this.server_map.push
        this.getAllServerNames( new_server )
      }
    }

    return this 
  }

  /** @param {NS} ns */
  getServerData( target: string ) : Server_Data_Custom {

    let data: Server = this.ns.getServer(target)
    let max_server_money = this.ns.getServerMaxMoney( target )

    let connection = this.ns
    return {
      ...data,
      hack: {
        money_from_single_thread:       this.ns.hackAnalyze( target ),
        hack_success_chance:            this.ns.hackAnalyzeChance(target),
        threads_to_hack_half_max_money: this.ns.hackAnalyzeThreads(target, 50*percent * max_server_money ),
        required_level_to_hack:         this.ns.getServerRequiredHackingLevel( target ),
      },
      weaken: {
        security_decrease:        this.ns.weakenAnalyze( 1 /* TODO */, this.host.cpuCores ),
        time_required:            this.ns.getWeakenTime( target ),
      },
      grow: {
        time_required:            this.ns.getGrowTime( target ), //ms
        growth_percentage:        this.ns.getServerGrowth( target ), //percent
        growth_security_increase: this.ns.growthAnalyzeSecurity(100, target, this.host.cpuCores ), // Security Increase for growing
        thread_requirements: {
          for150percent : this.ns.growthAnalyze( this.host.hostname, 150*percent , this.host.cpuCores ),
          for200percent : this.ns.growthAnalyze( this.host.hostname, 200*percent , this.host.cpuCores ),
        },
      }, 
    }
  } // getServerData
  
} // class

function s  ( str: string ) { return str.padEnd( 8 )}
function ms ( str: string ) { return str.padEnd( 12 )}
function m  ( str: string ) { return str.padEnd( 16 )}
function ml ( str: string ) { return str.padEnd( 24 )}
function l  ( str: string ) { return str.padEnd( 32 )}
  
