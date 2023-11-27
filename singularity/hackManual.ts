import {NS,Player,Server} from "../NetscriptDefinitions"
import { ServerPath } from "../lib/ServerPath"
import { ServerList } from "../lib/ServerList"
import { DataBroker } from "../global_data/data"

interface NetworkNode {
  node_name: string
  child_nodes: NetworkNode[]
}

interface HackTarget {
  player: Player
  hacking_money_ratio: number
  money_available: number
  server: Server
  ratio: number
  hack_success_chance: number
  hack_time: number
}

let broker = new DataBroker()

export async function main(ns:NS) {
  ns.tail()
  ns.moveTail(1450, 610)
  ns.resizeTail( 1050, 200)

  //ns.disableLog( "sleep")
  //ns.disableLog( "scan")
  ns.disableLog( "scan" )

  while ( true ) {
    
    let non_purchased_servers_with_money = broker.all_servers.filter(s=>!s.purchasedByPlayer&&(s.moneyMax??0) > 0)
  
    let best_to_hack:HackTarget  = pickBestToHack(ns, non_purchased_servers_with_money)
    let bth = best_to_hack
    
    let print_version = {
      name:             bth.server?.hostname,
      ratio:            bth.ratio.toFixed(2),
      money_available:  ns.formatNumber(bth.server.moneyAvailable??0),
      hacking_money:    ns.formatNumber(bth.hacking_money_ratio),
      max_money:        ns.formatNumber(bth.server.moneyMax??0),
      hacking_chance:   bth.hack_success_chance.toFixed(2),
      hacking_time:     `${Math.floor((bth.hack_time/1000))}s`,
    }
    //ns.print( JSON.stringify( print_version, null, 1 ) )
  
    let server_path = new ServerPath(ns,broker.data.singularity.current_server, bth.server.hostname )
    server_path.goToTarget()

    await ns.singularity.manualHack()
    
  }
}

function pickBestToHack( ns:NS, target_servers:Server[] ): HackTarget {
  let player = broker.data.player
  let best_hack_target:HackTarget = {
    player: player,
    hacking_money_ratio: 0,
    money_available: 0,
    server: target_servers[0],
    ratio: 0,
    hack_success_chance: 0,
    hack_time: 1,
  }

  for( let current_target_server of target_servers) {
    if ( !current_target_server.hasAdminRights ) continue
    
    let current_hack_target = getHackTarget(ns, player,current_target_server )

    // ns.print( `${current_hack_target.server.hostname}(${current_hack_target.ratio.toFixed(2)}) ` + 
    //   `with ${best_hack_target.server.hostname}(${best_hack_target.ratio.toFixed(2)})`)

    if ( current_hack_target.ratio > best_hack_target.ratio ) {
      // ns.print( `${current_hack_target.server.hostname}(${current_hack_target.ratio.toFixed(2)}) ` + 
      //   `has unseated ${best_hack_target.server.hostname}(${best_hack_target.ratio.toFixed(2)})`)

      best_hack_target = current_hack_target
    }
  }
  return best_hack_target
}

function calculateRatio(ns:NS, server:HackTarget ):number {
  let x = server.hack_success_chance
  let a = ( 2*x ) - ( .85*Math.E*x ) + 1
  let b = -( Math.log(.034)*x ) - 1.78
  let scaled_success = -(a-b)

  if ( server.money_available < 10000 ) return -5

  server.ratio = (( server.hacking_money_ratio * server.money_available * scaled_success) 
    / (server.hack_time?server.hack_time:1) ) 

  ns.tprint( `${server.server.hostname.padEnd( 24 )} success:${server.hack_success_chance.toFixed(3).padEnd( 20 )} scaled:${scaled_success.toFixed(3).padEnd(20)} ratio:${server.ratio.toFixed(3).padEnd(20)}`)

  return server.ratio
}

function getHackTarget(ns:NS, player:Player, target_server:Server):HackTarget {

  let server_analysis = broker.data.server_analysis[target_server.hostname]

  let hack_target_hostname              = target_server.hostname
  let hack_target_hacktime              = server_analysis.hack_time_required
  let hack_target_success_chance        = server_analysis.hack_success_chance
  let hack_target_money_ratio           = server_analysis.hack_money_ratio_stolen
  let hack_target_available_money       = target_server.moneyAvailable??0
  
  let hackTarget:HackTarget = {
    player,
    server:               target_server,
    ratio:                -1,
    money_available:      hack_target_available_money,
    hacking_money_ratio:  hack_target_money_ratio,
    hack_time:            hack_target_hacktime,
    hack_success_chance:  hack_target_success_chance,
  }
    
  // if ( hack_target_success_chance < .6 ) {
  //   return hackTarget
  // } 
  
  calculateRatio( ns, hackTarget )

  return hackTarget
}

export function autocomplete(data:any, args:any) {
  let results = []
  if ( data.servers ) results.push( ...data.servers )
  if ( data.scripts ) results.push( ...data.scripts )

  return results
}

