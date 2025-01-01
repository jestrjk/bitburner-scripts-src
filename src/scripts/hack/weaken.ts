
export async function main(ns: NS) {
  let target  = ns.args[0] as string
  ns.print( `[${target}] weakening...` )

  let weaken_result = await ns.weaken( target )
  ns.print( `[${target}] weaken result: ${weaken_result}` )
}

