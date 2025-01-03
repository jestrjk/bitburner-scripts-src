export async function main(ns: NS) {
    let target:string = ns.args[0] as string
    ns.print( `[${target}] growing...` )
    
    let grow_result = await ns.grow( target ) 
  }   

