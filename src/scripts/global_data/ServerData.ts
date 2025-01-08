
export enum LiteScriptNames {
  WEAKEN  = 'lite_weaken.ts',
  GROW    = 'lite_grow.ts', 
  HACK    = 'lite_hack.ts',
}


export class ServerData {
  constructor(ns:NS, serverName:string ) {
    
    this.server = ns.getServer(serverName)
    
    this.availableRam = this.server.maxRam! - this.server.ramUsed!
  }

  server:Server
  availableRam: number

  get hostname() { return this.server.hostname }

  /** 
   * The amount of money that could be added to the server
   * Calculated as maximum money minus current money
   * Used for targeting decisions and growth calculations
   * @returns {number} Maximum money minus available money
   */
  get moneyPotential() { return this.server.moneyMax! - this.server.moneyAvailable! }

  /** 
   * The ratio of current money to maximum money on the server
   * Used to determine if growing is needed and for targeting decisions
   * @returns {number} Current money divided by maximum money (0-1)
   */
  get moneyRatio() { return this.server.moneyAvailable! / this.server.moneyMax! }

  /** 
   * The difference between current hack difficulty and minimum hack difficulty
   * Used to determine if weakening is needed and how many threads to use
   * @returns {number} Current difficulty minus minimum difficulty
   */
  get difficultyDelta() { 
    return Math.round(this.server.hackDifficulty! - this.server.minDifficulty! ) 
  }

  isBeingManipulatedBy( ns:NS, script_hosts: ServerData[], script_name: LiteScriptNames ) {
    ns.print( `Checking if ${script_name} running on ${this.hostname}`)
    for( let script_host of script_hosts ) {
      let lite_scripts_running = ns.ps( script_host.hostname ).filter( 
        p => p.filename.includes(script_name) &&
        p.args[0] === this.hostname
      )
  
      if ( lite_scripts_running.length > 0 ) {
        ns.print( `Found ${this.hostname} ${script_name} scripts running on ${script_host.hostname}` )
  
        return true
      }
    }
    return false 
  }
}
