import { ServerData } from "./ServerData"

export class ServerDataProcess {
  constructor(process_info: ProcessInfo, script_host: Server) { 
    this.process_info = process_info  
    this.script_host = script_host  
  }

  process_info: ProcessInfo
  script_host: Server

  static sortByThreads( a: ServerDataProcess, b: ServerDataProcess ) {
    return b.process_info.threads - a.process_info.threads
  } 

  static filterByProcessFileName( process_info: ProcessInfo, process_name: string ) {
    

} 