
export class ServerAction {
  constructor( 
    hostname:string , threads: number, description: string, expires: number, 
    timestamp: number, script_host: string ) {

    this.hostname = hostname
    this.threads = threads
    this.description = description
    this.expires = expires
    this.timestamp = timestamp
    this.script_host = script_host
  }

    hostname: string 
    threads: number
    description: string
    expires: number
    timestamp: number
    script_host: string
}