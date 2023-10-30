/** @param {NS} ns */
export async function main(ns) {

	const target 							= ns.args[0] // server ) 
	const money_max 					= ns.args[1] // ns.getServerMaxMoney( server ) 
	const min_security_level 	= ns.args[2] // ns.getServerMinSecurityLevel( server )
	const money_buffer				= ns.args[3] || .5 * money_max
	const max_threads = Math.floor( ns.getServerMaxRam / ns.getScriptRam( ns.getScriptName() ) )

	let usage = `hack.js <target> <money_max> <min_security_level>`

	if ( ns.args.length != 3 ) throw usage ;


	let last_weaken = 0

	let random = Math.random() * 30 // s

	debug_log( target, `Initial Sleep: ${random.toFixed( 1 )}s`)
	await ns.sleep( random*1000 ) // ms

	while ( true ) {
		let money_available = 		ns.getServerMoneyAvailable( target ) 
		let security_level = 			ns.getServerSecurityLevel( target )
		let security_level_goal = Math.min((1 + min_security_level), 95 )
		// ns.tprint( `slg: ${security_level_goal} sl: ${security_level} lw: ${last_weaken} msl: ${min_security_level}`)
	
	  if ( security_level >= security_level_goal ) {
			last_weaken = await ns.weaken( target )
			continue
		} 


		if ( money_available <= money_max *.95 ){

			await ns.grow( target )
			continue
		}

		let hack_analysis_threads = ns.hackAnalyzeThreads(target, money_max / 2)
		let desired_threads = Math.floor( Math.min( hack_analysis_threads, max_threads ) )

 		await ns.hack(target, {threads: desired_threads})
	}

	function debug_log( server, msg ) {
		let output = `[${server}] ${msg}`

		ns.print( output ) 
		console.log( output )
		ns.tprint( output )
	}
}
