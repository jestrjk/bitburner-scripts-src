import {NS} from "./NetscriptDefinitions"

export async function main(ns:NS) {
  ns.tail()
  ns.disableLog( "asleep")
  ns.disableLog( "sleep")
  
  let dot = false
  let current_money:number[] = []
  while ( true ) {
    ns.clearLog()

    current_money.push( ns.getPlayer().money )
    while ( current_money.length > 50 ) {current_money.pop()}

    let money_per_seconds = (current_money[current_money.length-1] - current_money[0]) / current_money.length
    dot = !dot
    ns.print( `Money: ${ns.formatNumber(money_per_seconds,1)}/s ${printDot(ns, dot)}`)
    
    await ns.asleep( 1000 )
  }
  function printDot(ns:NS, dot:boolean) {
    if (dot) { return "\\" } else { return "/"}
  }

}