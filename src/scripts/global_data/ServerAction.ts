
export class ServerAction {
  constructor( 
    hostname:string , description: string, expires: number, 
    timestamp: number, script_host: string ) {

    this.hostname = hostname
    this.description = description
    this.expires = expires
    this.timestamp = timestamp
    this.script_host = script_host
  }

    hostname: string 
    description: string
    expires: number
    timestamp: number
    script_host: string
}