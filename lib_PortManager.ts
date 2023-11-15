import {NS, PortData} from "./NetscriptDefinitions"

export interface PortMonitorStats extends CalculatedPortMonitorStats {
  peeks:number
  reads:number
  writes:number
  monitoring_start: number //Date
}
export interface CalculatedPortMonitorStats{
  elapsed_time: number
  reads_per_second: number
  writes_per_second: number
}

export interface LiteScriptJSONParams {
  result: number
  hacktype: string
  hostname: string
  empty?: boolean 
}

export enum PortNumbers {
  liteScriptResults = 1,
  general,
}


export const hackTypes = {
  hack: "hack", 
  grow: "grow",
  weaken: "weaken" ,
}

const NULL_PORT_DATA:string = "NULL PORT DATA"
const portManagers:PortManager[] = []
class PortManager {
  constructor (ns:NS,port_numbers:PortNumbers) {
    this.ns = ns
    this.portNumbers = port_numbers
    this.monitoringStats = {
      peeks:0,
      reads:0,
      writes:0,
      monitoring_start: Date.now(),

      reads_per_second: 0,
      writes_per_second: 0,
      elapsed_time: 0,
    }
  } 

  ns:NS
  public readonly portNumbers:PortNumbers
  private monitoringStats:PortMonitorStats
  
  
  getMonitoringStats(): PortMonitorStats {
    this.updateMonitoringStats()
    return this.monitoringStats
  }

  private updateMonitoringStats() {
      this.monitoringStats.elapsed_time       
        = Date.now() - this.monitoringStats.monitoring_start

      let elapsed_time_in_seconds = Math.floor( this.monitoringStats.elapsed_time / 1000 )

      this.monitoringStats.reads_per_second   
        = this.monitoringStats.reads / Math.max(elapsed_time_in_seconds, 1 ) 
      this.monitoringStats.writes_per_second  
        = this.monitoringStats.writes / Math.max(elapsed_time_in_seconds, 1 )
  }

  hasContent():boolean {
    this.monitoringStats.peeks++
    let port_data = this.ns.peek( this.portNumbers )
    if ( port_data == NULL_PORT_DATA ) return false

    return true
  }

  readJSONPort(): LiteScriptJSONParams {
    this.monitoringStats.reads++

    let port_data = this.ns.readPort( this.portNumbers )
    if ( port_data === NULL_PORT_DATA ) return {
      empty: true,
      result: Infinity,
      hacktype: "",
      hostname: "",
    }

    return JSON.parse( port_data.toString() )
  }

  writeJSONPort(data:LiteScriptJSONParams):boolean {
    this.monitoringStats.writes++

    let _data = JSON.stringify( data )
    let result = this.ns.tryWritePort(this.portNumbers, _data)

    return result
  }

 peekPort() {
  this.monitoringStats.peeks++
  return this.ns.peek( this.portNumbers )
 }

}

export function getPortManagers() { return portManagers.slice(0) }

export function portManager(ns:NS, portNumber:PortNumbers):PortManager {
  if ( portManagers[portNumber] ) return portManagers[portNumber]
  let new_manager = new PortManager( ns, portNumber )
  portManagers[portNumber] = new_manager
  return new_manager
} 

export function clearPortManagers(ns:NS) {
  ns.tprint( `Clearing PortManagers`)
  let pm:PortManager | undefined
  while ( ( pm = portManagers.shift()) ) { ns.tprint( `Clearing: ${pm.portNumbers}`)}
}
