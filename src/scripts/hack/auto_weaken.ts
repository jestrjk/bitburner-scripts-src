import { HackableServer } from "./HackableServer"
import { DataBroker } from "../global_data/data"

let broker = new DataBroker()



export async function main ( ns:NS ) {
  ns.tail() 
  
  for ( let server of broker.all_servers ) {
    let hackable_server = new HackableServer( ns, server.hostname )
    await hackable_server.weaken()

    ns.exec( 'scripts/hack/weaken.ts', 'sh', server.threads, server.name )
  }

} 