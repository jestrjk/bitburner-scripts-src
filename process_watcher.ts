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
  ns.moveTail( 700, 0)
  ns.resizeTail( 750, 500)

  ns.disableLog( 'sleep' )

  ns.clearLog()

  while ( true ) {
    let { all_script_host_names, all_server_names, all_servers } = await getAllServersAndNames(ns, 'home')

    let script_host_ram = 0
    let script_host_max_ram = 0
    for ( let script_host_name of all_script_host_names ) {
      let max_ram = ns.getServerMaxRam( script_host_name ) 
      let used_ram  = ns.getServerUsedRam( script_host_name )
      
      script_host_max_ram  += max_ram
      script_host_ram += max_ram - used_ram
    }

    let proc_data: CustomProcessInfo[] = []
    getExtendedProcessInfo(all_script_host_names, proc_data)
    
    proc_data.sort( (procA, procB) => (procB.run_time_left - procA.run_time_left) )
    printExtendedProcessData(proc_data, script_host_ram, script_host_max_ram )
    
    await ns.sleep( 1000 )
  }

  function printExtendedProcessData(proc_data: CustomProcessInfo[], script_host_ram:number, script_host_max_ram:number ) {
    ns.clearLog()
    
    for (let proc of proc_data) {

      let rtdm = proc.run_time_date.getMinutes().toString().padStart(2,'0')
      let rtds = proc.run_time_date.getSeconds().toString().padStart(2,'0')
      let trm  = proc.time_required_minutes.toString().padStart(2,'0')
      let trs  = proc.time_required_seconds.toString().padStart(2,'0')

      ns.print(`[${proc.pid}] `.padEnd( 5 ) +
        `${proc.script_host_name}: `.padEnd(6) +
        `${proc.filename.slice(5).slice(0, -3)} `.padEnd(8) +
        `${proc.target_server_name} `.padEnd(16) +
        `(t=${proc.threads})`.padEnd(8) +
        `${rtdm}:${rtds}/` +
        `${trm}:${trs}`
      )
    }
    ns.print( `Hosting RAM: ${ns.formatNumber(script_host_ram,1)}/${ns.formatNumber(script_host_max_ram,1)}`)
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