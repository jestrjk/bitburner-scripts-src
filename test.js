import * as lib_ServerList from "lib_ServerList.js"

/** @param {NS} ns */
export async function main(ns) {

	let target = "joesguns"

	while ( true ) {
		let threads = Math.floor( Math.random() * 200 + 100 )
		await weaken( target, threads )
		await grow( target, threads )
		await hack( target, threads )

		await ns.sleep(10000)
	}

	async function weaken( target, threads ) {
		ns.tprint( `weaken( ${target}, threads: ${threads})`)
		await ns.weaken( target, {threads: threads})
	}

	async function grow( target, threads ) {
		ns.tprint( `grow( ${target}, threads: ${threads})`)
		await ns.grow( target, {threads: threads})
	}

	async function hack( target, threads ) {
		ns.tprint( `hack( ${target}, threads: ${threads})`)
		await ns.hack( target, {threads: threads})
	}
}