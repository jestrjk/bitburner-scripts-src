/* eslint-disable */
import { notStrictEqual } from "assert"
import {NS} from "./NetscriptDefinitions"
import {ServerList} from "./lib_ServerList"
import {toBillions, toHours, toHoursFromMinutes, toMillions, toMinutes, toPercent} from "./lib_utils"

export async function main ( ns: NS ) {

    let server_list = new ServerList(ns, 'home') 

    let player  = ns.getPlayer()
    let host    = ns.getServer()

    for( let server of server_list.all_servers ) {

      let grow_threads_required = ns.formulas.hacking.growThreads(server, player, server.moneyMax ?? 0 , host.cpuCores )
      let weaken_time           = ns.formulas.hacking.weakenTime( server, player )

      ns.tprint( `${server.hostname} `.padEnd( 20 ) + 
      `${format_money(server.moneyAvailable ?? 0)} `.padEnd( 10 ) + 
      `${format_money(server.moneyMax?? 0)} `.padEnd( 10 ) +
      `gtr: ${grow_threads_required} wt: ${format_time( weaken_time )}`.padEnd( 20 ) 
      )
    }

  function format_time ( minutes : number ): string {
    if ( toHoursFromMinutes(minutes) > 0 ) { return `${toHoursFromMinutes( minutes ).toFixed( 1 )}h` }
    return `${minutes.toFixed( 0 )}s`
  }
    
  function format_money ( amount: number ): string {
    let in_millions = toMillions( amount )
    let in_billions = toBillions( amount )
  
    if ( in_billions > 0 ) { return `$${in_billions.toFixed(1)}b` }
    if ( in_millions > 0 ) { return `$${in_millions.toFixed(1)}m` }
  
    return `$${amount.toFixed(1)}`
  }
    
}

