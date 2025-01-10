
export enum LiteScriptNames {
  WEAKEN  = 'lite_weaken.ts',
  GROW    = 'lite_grow.ts', 
  HACK    = 'lite_hack.ts',
}


export class ServerData {
  constructor(ns:NS, serverName:string ) {
    
    this.server = ns.getServer(serverName)
    
    this.availableRam = this.server.maxRam! - this.server.ramUsed!
    
    this.moneyStolenPerHackThread   = ns.hackAnalyze( serverName )
    this.hackChance                 = ns.hackAnalyzeChance( serverName )
    this.hackTime                   = ns.getHackTime( serverName )

    this.hackEfficiency             = this.hackChance * this.moneyStolenPerHackThread * this.server.moneyAvailable! / this.hackTime

    this.analysis_data = {
      processes: [],
    }
  }

  server:Server
  availableRam:               number
  moneyStolenPerHackThread:   number
  hackChance:                 number
  hackTime:                   number

  hackEfficiency:             number

  analysis_data: {
    processes: ProcessInfo[],

  }

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

  analyse( ns:NS, script_hosts: ServerData[] ) {
    this.analyseManipulationProcesses( ns, script_hosts ) 
  }

  analyseManipulationProcesses( ns:NS, script_hosts: ServerData[] ) {

    this.analysis_data.processes = []

    for( let script_host of script_hosts ) {
      let lite_scripts_running = ns.ps( script_host.hostname ).filter( 
        p => p.filename.includes('hack/lite_') && p.args[0] === this.hostname )
  
      if ( lite_scripts_running.length > 0 ) {
        ns.print( `Found ${lite_scripts_running.length} '${lite_scripts_running.map( p => p.filename)}' scripts running on {${script_host.hostname}}` )
        this.analysis_data.processes.concat( lite_scripts_running )
      }
    }
  }
}
