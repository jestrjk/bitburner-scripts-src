import { data, getScriptHosts }   from "../global_data/GlobalData"

export async function main (ns:NS) {
  ns.tail() 
  ns.moveTail( 200,200 )
  ns.resizeTail( 600, 120 )
  ns.disableLog( "sleep" )
  
  while ( true ) {
    ns.clearLog() 

    let hosts = getScriptHosts()

    for ( let host of hosts ) {
      let usedRam = Math.floor( host.server.ramUsed )
      let maxRam = host.server.maxRam
      let ramPct = usedRam / maxRam
      let barLength = 20
      let filledBars = Math.floor(ramPct * barLength)
      let bar = '[' + '='.repeat(filledBars) + ' '.repeat(barLength - filledBars) + ']'
      ns.print( `${host.hostname}: ${bar} (${Math.floor( ramPct*100) }%) ${usedRam}GB/${host.server.maxRam}GB` )
    }
 
    ns.print( new Date().toISOString())
    await ns.sleep( 1000 )
  }
}