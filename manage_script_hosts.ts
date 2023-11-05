/* eslint-disable */
import {NS} from "./NetscriptDefinitions" 

let Commands = {
  buy: "buy",
  upgrade: "upgrade",
  upgrade_cost: "upgrade_cost",
  purchase_costs: "purchase_costs",
  default: "default",
}

let server_sizes = [ 8, 16, 32, 64, 128, 256 ]

export async function main ( ns: NS ) {

  let command_arg = ns.args.shift()?.toString() ?? Commands.default
  
  switch ( command_arg ) {
    case Commands.buy:
      buy();              break ;
    case Commands.upgrade:
      upgrade() ;         break ;
    case Commands.upgrade_cost:
      upgrade_cost() ;    break ;
    
    default: 
    case Commands.purchase_costs: 
      printServerCosts(); 
      printPurchasedServers() ;
    break ;
  }

  function upgrade_cost() {
    let hostname: string  = ns.args.shift() as string
    let ram: number       = ns.args.shift() as number
    ns.tprint ( `upgrade <hostname>:${hostname} <ram>:${ram}`)
    
    let cost = ns.getPurchasedServerUpgradeCost( hostname, ram ) 
    ns.tprint( `Cost to upgrade ${hostname} to ${ram}: ${millions(cost)}m`)
  }

  function upgrade() {
    let hostname: string  = ns.args.shift() as string
    let ram: number       = ns.args.shift() as number

    let results = ns.upgradePurchasedServer( hostname, ram ) 
    ns.tprint( title(`Results`))
    ns.tprint( `UPGRADE attempt: ${results ? "succeeded" : "failed"}`)
    printPurchasedServers()
  }
  
  // Function DEFS
  function buy() {
    let hostname: string  = ns.args.shift() as string
    let ram: number       = ns.args.shift() as number
    ns.tprint ( `upgrade <hostname>:${hostname} <ram>:${ram}`)

    ns.tprint( title(`Results`))
    let results = ns.purchaseServer(hostname, ram)
    ns.tprint( `PURCHASE attempt: ${results ? "succeeded" : "failed"}`)
    printPurchasedServers()
  }
  
  function title(title: string) { return `---------- ${title} -----------` }

  function printServerCosts() {
    ns.tprint( title(`Server Costs`))
    for ( let size of server_sizes ) {
      ns.tprint( `${size.toString().padEnd( 6 )} ${(ns.getPurchasedServerCost( size )/1000000).toFixed(1)}m` )
    }
  }

  function printPurchasedServers() {
    ns.tprint( title(`Purchased Servers`))
    for ( let purchased_server_name of ns.getPurchasedServers() ) {
      ns.tprint( `${purchased_server_name.padEnd(20)} ${ns.getServerMaxRam( purchased_server_name )}`)
    }
  }

  function millions ( value: number ) {
    return `${(value/1000000).toFixed(1)}`
  }
} //main

