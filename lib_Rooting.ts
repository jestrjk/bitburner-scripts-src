/* eslint-disable */

import { notStrictEqual } from "assert";
import {NS, Server} from "./NetscriptDefinitions"

export class RootKit {
  ns: NS
  port_hacker : PortHackingPrograms 
  target_server: Server
  
  constructor( ns: NS, target_server: Server ) {
    this.ns = ns
    this.port_hacker    = new PortHackingPrograms( ns ) ;
    this.target_server  = target_server
  }

  /** run method returns try on rootkit success, false otherwise */
  run () {
    if ( this.target_server.hasAdminRights ) return true

    this.port_hacker.run( this.target_server.hostname )

    if ( (this.target_server.numOpenPortsRequired ?? 0) > ( this.target_server.openPortCount ?? 0) ) {
      return false
    }

    this.ns.nuke(this.target_server.hostname) 
    return true
  }

}

export class PortHackingPrograms {
  ns: NS
  program_list: string[]
  active_programs: string[]

  constructor(ns: NS) {
    this.ns = ns ;
    this.program_list = [
      "BruteSSH.exe",
      "FTPCrack.exe",
      "relaySMTP.exe",
      "HTTPWorm.exe",
      "SQLInject.exe",
    ]

    this.active_programs = [] ;

    this.get_active_programs() ;
  }

  get_active_programs() {
    for ( const program_name of this.program_list ) {
    
      if ( this.ns.fileExists( program_name ) ) {
        this.active_programs.push ( program_name ) 
      } else { this.ns.print( `[port_hacking] Can't find ${program_name}`)} 
  
    }
  }	

  run( server ) {
    for ( const program_name of this.active_programs ) {
      switch ( program_name ) {
        case "BruteSSH.exe":
          this.ns.brutessh( server )
          break;
        case "FTPCrack.exe":
          this.ns.ftpcrack( server )
          break;
        case "relaySMTP.exe":
          this.ns.relaysmtp( server )
          break;
        case "HTTPWorm.exe":
          this.ns.httpworm( server )
          break;
        case "SQLInject.exe":
          this.ns.sqlinject( server )
          break;
        default:
          throw new Error( `[${server}] Invalid program name to execute: ${program_name} `)
      }
    }
  }
} // /-PortHacking Class-/
