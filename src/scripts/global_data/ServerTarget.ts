
export interface ServerAnalysisData {
  weakenAnalyseData:          number
  growthAnalyzeData:          number
  hack_time_required:         number
  hack_money_ratio_stolen:    number
  hack_success_chance:        number
  hack_threads_for_75percent: number
  grow_time_required:         number
  running_scripts:            ProcessInfo[]
}

export class ServerTarget {
  constructor(ns:NS, serverName:string){
    this.server = ns.getServer(serverName)
  }

  server: Server

  get hostname() { return this.server.hostname }
}
