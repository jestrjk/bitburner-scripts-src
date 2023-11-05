/* eslint-disable */
import {NS, ProcessInfo} from "./NetscriptDefinitions"
import {getAllServersAndNames} from "./lib_ServerList"

interface CustomProcessInfo extends ProcessInfo {
  target_server_name:     string
  script_host_name:       string
  run_time:               number
  run_time_date:          Date
  run_time_left:          number
  time_required_minutes:  number
  time_required_seconds:  number
}

export async function main ( ns: NS ) {
  ns.tail() 

  let { all_script_host_names, all_server_names, all_servers } = await getAllServersAndNames(ns, 'home')
  while ( true ) {
    let proc_data: CustomProcessInfo[] = []
    getExtendedProcessInfo(all_script_host_names, proc_data)
    
    proc_data.sort( (procA, procB) => (procA.run_time_left - procB.run_time_left) )
    printExtendedProcessData(proc_data)
    
    await ns.sleep( 1000 )
  }

  function printExtendedProcessData(proc_data: CustomProcessInfo[]) {
    ns.clearLog()

    for (let proc of proc_data) {

      ns.print(`[${proc.pid}] ` +
        `${proc.script_host_name}:${proc.filename}(t=${proc.threads})`.padEnd(32) +
        `${proc.target_server_name} `.padEnd(20) +
        `${proc.run_time_date.getMinutes()}:${proc.run_time_date.getSeconds()}/` +
        `${proc.time_required_minutes}:${proc.time_required_seconds}`
      )
    }
  }

  function getExtendedProcessInfo(script_host_names: string[], proc_data: CustomProcessInfo[] ) {
    
    for( let script_host_name of script_host_names ) {
      for (let proc of ns.ps(script_host_name) ) {
        if ( ! proc.filename.startsWith( `lite_`) ) continue
      
        let target_server_name  = proc.args[0] as string
        let started_at          = proc.args[1] as number
        let time_required       = proc.args[2] as number

        let time_required_minutes: number = Math.floor(time_required / 60000)
        // subtract the minutes fromor you you get the absolute time required in seconds, not just the seconds "left"
        let time_required_seconds: number = Math.floor(time_required / 1000 - time_required_minutes * 60)

        let now = Date.now()
        let run_time = now - started_at
        let run_time_date = new Date(run_time)
        let run_time_left = time_required - run_time

        proc_data.push({
          ...proc,
          run_time,
          run_time_date,
          run_time_left,
          target_server_name,
          time_required_seconds,
          time_required_minutes,
          script_host_name,
        })
      }
    }
  }
}