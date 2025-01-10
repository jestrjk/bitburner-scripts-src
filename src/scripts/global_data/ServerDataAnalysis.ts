import { ServerDataProcess } from "./ServerDataProcess"

export class ServerDataAnalysis {
  constructor(ns:NS, script_host: Server) {
    this.refreshRelatedProcesses( ns, script_host )
  }

  hasRunninScripts(): boolean {
    return false
  }

  refreshRelatedProcesses(ns: NS, script_host: Server):number {
    this.related_processes = []

    let running_processes = ns.ps(script_host.hostname)
    for (let process of running_processes) {
      this.related_processes.push(new ServerDataProcess(process, script_host))
    }

    return this.related_processes.length
  }

  related_processes: ServerDataProcess[] = []

}