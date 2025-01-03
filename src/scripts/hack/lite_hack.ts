export async function main(ns : NS) {
    let target: string  = ns.args[0] as string
    ns.print( `[${target}] hack...` )

    let hack_result = await ns.hack( target )
}

