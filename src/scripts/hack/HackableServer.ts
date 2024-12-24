import { DataBroker } from "../global_data/data";
import { ServerAnalysisData } from "../global_data/data";

let broker = new DataBroker()
export async function main(ns:NS) {
  ns.tail() 

  let hackable_server_name = ns.args[0] as string
  let hackable_server = new HackableServer( ns, hackable_server_name )

  while ( true ) {
    await hackable_server.auto_hack()
  }

}

export class HackableServer {
  constructor(
    public ns: NS,
    public name: string
  ) {
    this.ns               = ns ;
    this.name             = name ;
    this.running_process  = this.ns.getRunningScript()!
    this.analysis         = broker.getAnalysisData(this.name)
    this.server_data      = broker.getServerData(this.name)
  }

  analysis: ServerAnalysisData 
  server_data: Server 
  running_process: RunningScript 

  public async auto_hack() {

    this.analysis         = broker.getAnalysisData(this.name)
    this.server_data      = broker.getServerData(this.name)

    let weaken_amount     = this.analysis.weakenAnalyseData

    if ( Math.floor( this.server_data.minDifficulty! + 3 ) < this.server_data.hackDifficulty!) {
      await this.weaken()
    }

    if ( this.server_data.moneyAvailable! > .75 * this.server_data.moneyMax!) {
      await this.hack() 
    } else {
      this.ns.print( `GROW: Money Available: ${this.server_data.moneyAvailable}, Money Max: ${this.server_data.moneyMax}` )
      await this.grow()
    }

    await this.ns.sleep( 500 )
  }

  public async grow() {
    
    broker.data.server_diffs.push(  {
      timestamp: Date.now(),
      hostname: this.name,
      diff_summary: "grow",
      time_to_live: this.analysis.grow_time_required,
    })

    let threads = Math.min( this.analysis.growthAnalyzeData, this.running_process.threads )
    await this.ns.grow( this.name, { threads: threads } )  
  }

  public async hack() {

    broker.data.server_diffs.push(  {
      timestamp: Date.now(),
      hostname: this.name,
      diff_summary: "hack",
      time_to_live: this.analysis.hack_time_required,
    })

    let threads = Math.min( this.analysis.hack_threads_for_75percent, this.running_process.threads )
    await this.ns.hack( this.name, { threads: threads } )
  }
  public async weaken() {
    
    broker.data.server_diffs.push(  {
      timestamp: Date.now(),
      hostname: this.name,
      diff_summary: "weaken",
      time_to_live: this.ns.getWeakenTime(this.name ),
    })

    await this.ns.weaken( this.name, { threads: this.running_process.threads } )
  }
  
}