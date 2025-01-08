
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

export enum LiteScriptNames {
  WEAKEN  = 'lite_weaken.ts',
  GROW    = 'lite_grow.ts', 
  HACK    = 'lite_hack.ts',
}

export class CustomServerData {
  constructor(ns:NS, serverName:string ) {
    
    this.ns = ns
    this.server = ns.getServer(serverName)
  }

  ns:NS
  server: Server

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
    return Math.round(this.server.hackDifficulty! - this.server.minDifficulty!) 
  }

}
