import {CrimeType, NS} from "./NetscriptDefinitions"
interface NetworkNode {
  node_name: string
  child_nodes: NetworkNode[]
}

export async function main(ns:NS) {
  ns.tail()
  //ns.disableLog( "sleep")
  //ns.disableLog( "scan")
   
  while ( true ) {
    await ns.singularity.manualHack()
        
    // let time = ns.singularity.commitCrime("Homicide", false)
    // await ns.sleep( time+100 )
  }

  // ns.atExit(() => ns.singularity.connect( 'home' ))

  // let hostname = ns.getServer().hostname
  
  // let root_node = buildNetwork(hostname)
  // ns.print( JSON.stringify( root_node, null, 1 ) )
  // ns.asleep( 10000 )
  
  // let schema = [["target", ""]]
  // let options = ns.flags( [["target", ""]])
  // ns.print ( JSON.stringify( options, null, 1 ))
  // if ( options.target == "" ) { 
  //   ns.print( `USAGE: ${JSON.stringify( schema, null, 1 )}`)
  //   throw `Must include target: ${JSON.stringify( ns.args, null, 1)}`
  // }
  // let target = options.target.toString()
  
  // ns.singularity.connect( target )
  // while ( true ) {
  //    let money_stolen = await ns.singularity.manualHack()
  // }
  
  // function buildNetwork( root_node_name: string ): NetworkNode[] {
  //   let new_node:NetworkNode = {
  //     node_name: root_node_name,
  //     child_nodes: ns.scan( root_node_name ).map(n => {
  //       node_name: n,

  //       }
  //       root_node_name:n,
  //       child
  //     })
  //   }
    
  // }
}