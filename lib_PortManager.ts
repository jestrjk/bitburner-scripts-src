/* eslint-disable */
import {NS} from "./NetscriptDefinitions"

const NULL_PORT_DATA:string = "NULL PORT DATA"

export interface PortMonitorStats extends CalculatedPortMonitorStats {
  reads:number
  writes:number
  monitoring_start: number //Date
}

export interface CalculatedPortMonitorStats{
  elapsed_time: number
  reads_per_second: number
  writes_per_second: number
}

export class PortManager {
  constructor (ns:NS,port_numbers:PortNumbers) {
    this.ns = ns
    this.portNumbers = port_numbers
    this.monitoringStats = {
      reads:0,
      writes:0,
      monitoring_start: Date.now(),

      reads_per_second: 0,
      writes_per_second: 0,
      elapsed_time: 0,
    }
  } 

  ns:NS
  private portNumbers:PortNumbers
  private monitoringStats:PortMonitorStats
  
  getMonitoringStats(): PortMonitorStats {
    this.updateMonitoringStats()
    return this.monitoringStats
  }

  private updateMonitoringStats() {
      this.monitoringStats.elapsed_time       = Date.now() - this.monitoringStats.monitoring_start
      this.monitoringStats.reads_per_second   = this.monitoringStats.reads / Math.max( this.monitoringStats.elapsed_time, .0001 )*1000 // divide by zero protection
      this.monitoringStats.writes_per_second  = this.monitoringStats.writes / Math.max( this.monitoringStats.elapsed_time, .0001 )*1000 // divide by zero protection
  }

  hasContent():boolean {
    let port_data = this.ns.peek( this.portNumbers )
    if ( port_data == NULL_PORT_DATA ) return false

    return true
  }

  readJSONPort() {
    this.monitoringStats.reads++

    let port_data = this.ns.readPort( this.portNumbers )
    if (port_data == NULL_PORT_DATA) return {}
    
    return JSON.parse( port_data.toString() ) 
  }

  writeJSONPort(data:any):boolean {
    this.monitoringStats.writes++

    let _data = JSON.stringify( data )
    return this.ns.tryWritePort(this.portNumbers, _data)
  
  }

 peekPort() {}

}

export enum PortNumbers {
  liteScriptResults = 1,
  general,
}