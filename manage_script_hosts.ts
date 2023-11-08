/* eslint-disable */
import {NS} from "./NetscriptDefinitions" 

let Commands = {
  purchase: "purchase",
  upgrade: "upgrade",
  upgrade_cost: "upgrade_cost",
  purchase_costs: "purchase_costs",
  default: "default",
}

let server_sizes = [ 64, 128, 256, 512, 1024, 2048 ]

export async function main ( ns: NS ) {
  let command_arg = ns.args.shift()?.toString() ?? Commands.default
  
  ns.tail()

  ns.print( `Your Money: ${ns.formatNumber(ns.getPlayer().money,1)}`)
  
  switch ( command_arg ) {
    case Commands.purchase:
      purchase();              break ;
    case Commands.upgrade:
      upgrade() ;         break ;
    case Commands.upgrade_cost:
      upgrade_cost() ;    break ;
    
    default: 
    case Commands.purchase_costs: 
      ns.print( `Bad command: ${command_arg}`)
      printPurchasedServerCosts() ;
      printMyPurchasedServers() ;
    break ;
  }

  function upgrade_cost() {
    let hostname: string  = ns.args.shift() as string
    let ram: number       = ns.args.shift() as number
    ns.print ( `upgrade <hostname>:${hostname} <ram>:${ram}`)
    
    let cost = ns.getPurchasedServerUpgradeCost( hostname, ram ) 
    ns.print( `Cost to upgrade ${hostname} to ${ram}: ${millions(cost)}m`)
  }

  function upgrade() {
    let hostname: string  = ns.args.shift() as string
    let ram: number       = ns.args.shift() as number

    let results = ns.upgradePurchasedServer( hostname, ram ) 
    ns.print( title(`Results`))
    ns.print( `UPGRADE attempt: ${results ? "succeeded" : "failed"}`)
    printMyPurchasedServers()
  }
  
  // Function DEFS
  function purchase() {
    let hostname: string  = ns.args.shift() as string
    let ram: number       = ns.args.shift() as number
    ns.print ( `upgrade <hostname>:${hostname} <ram>:${ram}`)

    ns.print( title(`Results`))
    let results = ns.purchaseServer(hostname, ram)
    ns.print( `PURCHASE attempt: ${results ? "succeeded" : "failed"}`)
    printMyPurchasedServers()
  }
  
  function title(title: string) { return `---------- ${title} -----------` }

  function printPurchasedServerCosts() {

    ns.print( title(`Server Costs`))
    
    for ( let size of server_sizes ) {
      ns.print( `${size.toString().padEnd( 6 )} ${(ns.getPurchasedServerCost( size )/1000000).toFixed(1)}m` )
    }


  }

  function printMyPurchasedServers() {
    ns.print( title(`Purchased Servers`))
    for ( let purchased_server_name of ns.getPurchasedServers() ) {
      ns.print( `${purchased_server_name.padEnd(20)} ${ns.getServerMaxRam( purchased_server_name )}`)
    }
  }

  function millions ( value: number ) {
    return `${(value/1000000).toFixed(1)}`
  }
} //main

