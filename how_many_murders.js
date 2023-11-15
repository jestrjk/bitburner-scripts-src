/** @param {NS} ns */
export async function main(ns) {
  let player = ns.getPlayer()

  ns.singularity.commitCrime(CrimeType.assassination,true )

  ns.tprint ( `Murders: ${player.numPeopleKilled}` )
}