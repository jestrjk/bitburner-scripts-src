import { CustomServerDataList } from "./CustomServerDataList"

export async function main (ns:NS) {
  ns.tprint( "Fuck" )

  while ( true ) {
    ns.clearLog() 
    ns.tail()
    ns.disableLog( "scan")

    let custom_server_data_list = new CustomServerDataList( ns )
    ns.print( JSON.stringify( custom_server_data_list.all_servers.map( s => s.hostname ), null, 2))
    
    ns.print( JSON.stringify( custom_server_data_list.getScriptHosts().map( s => s.hostname ), null, 2))

    ns.print( new Date().toISOString() )
    await ns.sleep( 1000 ) 
  }
}

