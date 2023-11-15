import {NS} from "./NetscriptDefinitions"

export async function main(ns:NS) {
  ns.tail()
  
  ns.atExit(() => ns.singularity.connect( 'home' ))
  
  let schema = [["target", ""]]
  let options = ns.flags( [["target", ""]])
  
  if ( options.target = "" ) { 
    ns.print( `USAGE: ${JSON.stringify( schema, null, 1 )}`)
    throw `Must include target: ${JSON.stringify( ns.args, null, 1)}`
  }

  ns.print ( options )

  let target = options.target.toString()
  ns.print ( `target ${target}`)

  ns.singularity.connect( target )
  while ( true ) {
    let money_stolen = await ns.singularity.manualHack()
  }
}