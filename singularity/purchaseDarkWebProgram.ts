import { NS } from "../NetscriptDefinitions";

export async function main(ns:NS) {
  ns.tail()
  ns.moveTail( 400, 400 )
  ns.singularity.purchaseTor()  
  
  let programs = ns.singularity.getDarkwebPrograms()
  for( let program of programs ) {
    let cost = ns.singularity.getDarkwebProgramCost( program )
    ns.print( `${program.padEnd( 20 )} $${ns.formatNumber( cost,1)}`)
  }
  
  let choice:string = <string> await ns.prompt( "What program to purchase from the DarkWeb?", {
    type: "select",
    choices: programs,
  })

  ns.singularity.purchaseProgram(choice)
  await ns.sleep( 10000 )
  ns.closeTail()
}

export function autocomplete(data:any, args:any) {
  let results = []
  if ( data.servers ) results.push( ...data.servers )
  if ( data.scripts ) results.push( ...data.scripts )

  return results
}
