/* eslint-disable */
import * as lib_args from '../lib/argumentProcessor'
import { disableNSFunctionLogging } from '../lib/utils'
import { colors, toMillionsFormatted } from '../lib/utils'
import { ServerData } from '../global_data/ServerData'

import { data } from '../global_data/GlobalData'

interface Server_Info_Extended extends Server {
	weaken_time: number
	grow_time: number
	hack_time: number
}

/** @param {NS} ns */
export async function main(ns : NS) {
	disableNSFunctionLogging( ns )

	let arg_data = lib_args.processArguments( ns ) 
	//let hacking_level_limit = arg_data.options.limit 

	ns.tail( ns.pid )
	ns.moveTail( 1400, 0 )
	ns.resizeTail( 1100, 600 )

	while ( true ) {
		ns.clearLog()

		let all_servers: 	ServerData[] = data.server.data
		let sorted_servers = all_servers.sort( ( a, b ) => b.hackEfficiency - a.hackEfficiency )
		
		let printHeaders = () => ns.print( 
			`hostname`								.padEnd( 24 ) +
			`diff`										.padEnd( 8 ) +
			`reqhack`									.padEnd(8) +
			`$avail`									.padEnd(12) +
			`$max`										.padEnd(12) + 
			`difficulty`							.padEnd(12) +  
			`adminrights`							.padEnd(12) +
			`hack eff`								.padEnd(15) 
		)

		printHeaders()

		for( let serverData of sorted_servers )  {		
			let s = serverData.server // because fuck you keyboard
			
			let hasAdminRights = s.hasAdminRights? "ROOT":"----"

			let line_color = colors.reset
			if ( s.moneyMax === 0 ) line_color = colors.brightCyan
			
			let actions = data.server.actions.filter( a => a.hostname == serverData.hostname ).map( a => a.description )
			let flagString = actions.sort().join("")

			if ( flagString.length > 0 ) line_color = colors.brightMagenta

			ns.print ( 
				`${line_color}` + 
				`${s.hostname}`																					.padEnd(24) +
				flagString								    													.padEnd(8) +
				`${s.requiredHackingSkill}`															.padEnd(8) +
				`${toMillionsFormatted( s.moneyAvailable! )}`	.padEnd(12) +
				`${toMillionsFormatted( s.moneyMax! )}`					.padEnd(12) + 
				`${(s.hackDifficulty??-1).toFixed(0)}` 									.padEnd(6) +  
				`${s.minDifficulty}`																		.padEnd(6) + 
				`${hasAdminRights}(${s.numOpenPortsRequired??-1})`			.padEnd(12) +
				`${serverData.hackEfficiency.toFixed( 2 )}`												  .padEnd(5)
			)
		}

		printHeaders()
		ns.print( new Date().toISOString() )

		await ns.sleep( 1000 )
	}	// while(true)

	function pe( text: string, fixed_amount: number ) {
		return `${text.padEnd(fixed_amount)}`
	}

	function fixed( value: number, decimal_places: number ) {
		return `${value.toFixed( decimal_places )}`
	}
	
	function toMinutes( seconds: number ): string { return (seconds/1000/60).toFixed( 1 )}
} // main()

// FUNCTIONS
