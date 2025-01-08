import { GlobalData } from "./GlobalData"

export async function main( ns:NS ) {
  let data = new GlobalData(ns)

  let SERVER_LIST = ns.getPortHandle( 10 ) 
  let SERVER_ACTIONS = ns.getPortHandle( 20 ) 

  while ( true ) {
    ns.tail() 

    ns.print( "writing" )
    
    SERVER_LIST.tryWrite( data.server_targets )
    await ns.sleep( 1000 )

    ns.print( "reading" )
    let data = JSON.parse( SERVER_LIST.read() ) as GlobalData 

    ns.print ( data.server_targets.all_servers.map( s=> s.hostname ) )

    await ns.sleep( 1000 ) 
  }
}
