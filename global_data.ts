import { Player, Server } from "./NetscriptDefinitions"
import { ServerList } from "./lib/ServerList"

export interface GlobalData {
  server_list: ServerList
  player: Player
}

export class DataBroker {
  constructor() { }

  get all_servers() {
    return data.server_list?.all_servers
  }

  getServer(hostname:string): Server {
    return <Server>data.server_list?.all_servers.filter(s=>s.hostname == hostname)[0]
  }
}

export const data:Partial<GlobalData> = {
}

