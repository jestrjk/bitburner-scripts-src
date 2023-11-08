/* eslint-disable */
import {NS} from "./NetscriptDefinitions";

export async function main (ns:NS) {
  ns.tail() 
  ns.disableLog(`sleep`)

  while(true) {
    
    while ( ns.peek( 1 ) != "NULL PORT DATA" ) {
      ns.print( ns.readPort(1) )
      await ns.sleep( 100 )
    }

    await ns.sleep( 1000 ) 
  }//while true
}//main