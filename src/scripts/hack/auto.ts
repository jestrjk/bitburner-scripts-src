import { HackableServer } from "./HackableServer"
import { DataBroker } from "../global_data/data"

let broker = new DataBroker()

let servers = [
  {name: "n00dles", threads: 20 },
  {name: "foodnstuff", threads: 300 },
  {name: "sigma-cosmetics", threads: 300 },
  {name: "joesguns", threads: 500 },
  {name: "nectar-net", threads: 700},
  {name: "hong-fang-tea", threads: 500 },
  {name: "harakiri-sushi", threads: 500 },
  {name: "iron-gym", threads: 1000 },
  {name: "neo-net", threads: 800 },
  {name: "zer0", threads: 800 },
  {name: "max-hardware", threads: 500 },
]

export async function main ( ns:NS ) {
  ns.tail() 
  
  for ( let server of servers ) {
    /* let hackable_server = new HackableServer( ns, server.name )
    await hackable_server.auto_hack() */

    ns.exec( 'scripts/hack/HackableServer.ts', 'sh', server.threads, server.name )
  }

} 