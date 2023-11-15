/* eslint-disable */

import { NS } from "./NetscriptDefinitions"
import { testPort } from "./lib_utils"

export async function main( ns: NS ) {
  ns.tail() 
  
  while ( true ) {
    ns.tail() 

    while (true ) {
      let initial = Date.now()
      await ns.sleep(1000) 
      let now = Date.now()
  
      let di = new Date ( initial )
      let dn = new Date ( now )

      let diff = dn.)
      let dd = new Date ( diff )
  
  
      ns.print ( `init: ${sepDate(di)} now: ${sepDate(dn)} diff: ${sepDate(dd)}` )
    }


    
    function sepDate( d:Date ) { 
      return [ d.getHours(), d.getMinutes() , d.getSeconds()]
    }
    
  }

}


