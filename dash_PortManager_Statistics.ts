import {NS} from "./NetscriptDefinitions"
import * as PM  from "./lib_PortManager"

export async function main(ns:NS) {
  ns.tail() 
  ns.moveTail(1885, 1020)
  ns.resizeTail(660,100)

  ns.clearLog()

  PM.clearPortManagers(ns)  

  while(true) {
    ns.clearLog()
    let pm = PM.getPortManager(ns, PM.PortNumbers.liteScriptResults)
    let stats = pm.getMonitoringStats()
    let port_numbers = pm.portNumbers
    ns.print( header() )
    
    let seconds = Math.floor( (stats.elapsed_time / 1000) % 60 ) 
    let minutes = Math.floor( (stats.elapsed_time / 1000 / 60) % 60 )
    let hours   = Math.floor( (stats.elapsed_time / 1000 / 3600) % 60 )
    let days    = Math.floor( (stats.elapsed_time / 1000/ (3600*24)) )
        
    let tf = (value:number) => value.toString().padStart( 2 , "0")

    ns.print(
      `port:${pm.portNumbers.toString()}`.padEnd(12) +
      `${tf(days)}:${tf(hours)}:${tf(minutes)}:${tf(seconds)}`.padEnd(16) +
      `${stats.peeks}`.padEnd(6) +
      `${stats.reads}`.padEnd(8) +
      `${stats.reads_per_second.toFixed(1)}`.padEnd(8) +
      `${stats.writes}`.padEnd(8) +
      `${stats.writes_per_second.toFixed(1)}`.padEnd(8) +
      ``
    )

    await ns.asleep(1000) 

    function header():string {
      let header = 
        `port` .padEnd(12) +
        `elapsed_time`.padEnd(16) +
        `peeks`.padEnd(6) +
        `reads`.padEnd(8) +
        `reads/s`.padEnd(8) +
        `writes`.padEnd(8) +
        `writes/s`.padEnd(8) +
        ``
      return header
    }
  }
 
}