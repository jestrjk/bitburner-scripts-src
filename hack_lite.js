/** @param {NS} ns */
export async function main(ns) {

  let target  = ns.args[1] || exit_usage()
  let threads = ns.args[3] || exit_usage()

  await ns.hack(target, {threads: threads})
}

function exit_usage () {
  usage()
  ns.exit()
}

function usage() {
  log ( `${ns.getScriptName} <weaken|grow|hack> <target server> <thread count>`)
}

function log ( server, str ) {
  ns.tprint ( str )
  ns.print ( str ) 
  console.log ( str ) 
}
