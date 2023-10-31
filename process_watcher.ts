/* eslint-disable */
import {NS} from "./NetscriptDefinitions"

export async function main ( ns: NS ) {
  while ( true ) {
    for( let proc of ns.ps(ns.getServer().hostname).filter( (proc) => (proc.filename.startsWith("lite_") )) ) {
      ns.print( `[${proc.pid}]${proc.filename} ${proc.args} t=${proc.threads}`)
    }
    
      await ns.sleep( 1000 )
      ns.clearLog()
  }
}