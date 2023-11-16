import {NS} from "./NetscriptDefinitions"

export async function main(ns:NS) {
  ns.tail()
  
  let [ window_width, window_height] = ns.ui.windowSize()
  let desired_tail_width = 200
  let desired_tail_height = 100
  ns.moveTail(window_width-desired_tail_width, window_height-desired_tail_height-5)
  ns.resizeTail(desired_tail_width,desired_tail_height)

  ns.disableLog( "asleep")
  ns.disableLog( "sleep")
  
  let dot = false
  let current_money_history:number[] = []
  while ( true ) {
    ns.clearLog()
    
    let player = ns.getPlayer()

    while ( current_money_history.length > 10 ) {current_money_history.shift()}
    current_money_history.push( Math.floor( player.money ) )

    let average = current_money_history.reduce( (prev,current)=>prev + current-prev, 0 ) / 10//s 
    

    let money_per_second = (current_money_history[current_money_history.length-1] - current_money_history[0]) / current_money_history.length
    dot = !dot
    
    let NaN = Number.isNaN( money_per_second )
    if ( Number.isNaN( money_per_second ) ) { money_per_second = 0}

    //p( `MoneyHistroy: ${JSON.stringify(current_money_history)}`)
    p( `Money: ${ns.formatNumber(money_per_second,1)}/s${NaN?`(NaN)`:``} ${printDot(ns, dot)}`)
    p( `Karma: ${player.numPeopleKilled *3} / 54000` ) 

    await ns.asleep( 1000 )
  }//while(true)

  // FUNCTIONS
  function printDot(ns:NS, dot:boolean) {
    if (dot) { return "\\" } else { return "/"}
  }
  
  function p(msg:string){
    ns.print( msg ) 
  }
 }// main

  