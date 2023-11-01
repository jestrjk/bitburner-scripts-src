/* eslint-disable */
import {NS, ProcessInfo} from "./NetscriptDefinitions"

interface CustomProcessInfo extends ProcessInfo {
  target_server_name:     string
  run_time:               number
  run_time_date:          Date
  run_time_left:          number
  time_required_minutes:  number
  time_required_seconds:  number
}

export async function main ( ns: NS ) {
  ns.tail() 

  while ( true ) {
    let now = Date.now() 

    let proc_data: CustomProcessInfo[] = []
    for( let proc of ns.ps(ns.getServer().hostname).filter( (proc) => (proc.filename.startsWith("lite_") )) ) {
      let target_server_name  = proc.args[0] as string
      let started_at          = proc.args[1] as number
      let time_required       = proc.args[2] as number
      
      let time_required_minutes: number = Math.floor( time_required/60000 )
      // subtract the minutes fromor you you get the absolute time required in seconds, not just the seconds "left"
      let time_required_seconds: number = Math.floor( time_required/1000 - time_required_minutes*60 ) 
      
      let now = Date.now() 
      let run_time        = now - started_at
      let run_time_date   = new Date( run_time )
      let run_time_left   = time_required - run_time

      proc_data.push( {
        ...proc,
        run_time,
        run_time_date,
        run_time_left,
        target_server_name,
        time_required_seconds,
        time_required_minutes,
      })
    }

    proc_data.sort( (procA, procB) => (procA.run_time_left - procB.run_time_left) )
    for ( let proc of proc_data) {
      
      ns.print( `[${proc.pid}] ` +
        `${proc.filename}(t=${proc.threads})`.padEnd( 20 ) +
        `${proc.target_server_name} `.padEnd( 16 ) +
        `${proc.run_time_date.getMinutes()}:${proc.run_time_date.getSeconds()}/` +
        `${proc.time_required_minutes}:${proc.time_required_seconds}`
        )
    }


    
      await ns.sleep( 1000 )
      ns.clearLog()
  }
}