import { Player, Server } from "./NetscriptDefinitions"
import { ServerList } from "./lib/ServerList"

export interface ServerAnalysisData {
  hostname: string
  weakenAnalyseData: number
  growthAnalyzeData: number
  hackAnalyzeThreadsData: number
  growtimeData: number
}

export interface ServerAnalysis {
  [key:string]: ServerAnalysisData
}
export interface GlobalData {
  server_list: ServerList
  server_analysis: ServerAnalysis 
  player: Player
  singularity: {
    current_server: string
  }
}

export class DataBroker {
  constructor() { }

  get all_servers():Server[] {
    return data.server_list!.all_servers
  }
  get script_hosts(): Server[] {
    return data.server_list!.script_hosts
  }
  get data(): GlobalData {
    return <GlobalData>data
  }
  getServerData(hostname:string): Server {
    return <Server>data.server_list?.all_servers.filter(s=>s.hostname == hostname)[0]
  }
  getAnalysisData( hostname:string ): ServerAnalysisData {
    return data.server_analysis![hostname]
  }
}

export const data:Partial<GlobalData> = {
  
}

