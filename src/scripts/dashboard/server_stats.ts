/* eslint-disable */
import * as lib_args from '../lib/argumentProcessor'
import { colors, toMillionsFormatted } from '../lib/utils'
import { ServerTarget } from '../global_data/ServerTarget'

import { getData } from '../global_data/GlobalData'



interface Server_Info_Extended extends Server {
	weaken_time: number
	grow_time: number
	hack_time: number
}

/** @param {NS} ns */
export async function main(ns : NS) {
	ns.clearLog()
	ns.disableLog("sleep")

	let arg_data = lib_args.processArguments( ns ) 
	let hacking_level_limit = arg_data.options.limit 

	ns.tail( ns.pid )
	ns.moveTail( 1400, 0 )
	ns.resizeTail( 1100, 600 )

	let data = getData()

	while ( true ) {
		ns.clearLog()

		let all_servers: 	ServerTarget[] = data.server_targets.all_servers

		let byHackingLevelLimit = ( server: any ) => ( server.hacking_level_required < hacking_level_limit ) 

		function sortByReqHackSkill_Ascending(a:any,b:any) { return ( a.requiredHackingSkill! - b.requiredHackingSkill!) }
		function sortByReqHackSkill_Descending(a:any,b:any) { return ( b.requiredHackingSkill! - a.requiredHackingSkill!) }
		
		let sorted_servers = all_servers.sort( sortByReqHackSkill_Ascending )

		let printHeaders = () => ns.print( 
			`hostname`								.padEnd( 24 ) +
			`diff`										.padEnd( 8 ) +
			`reqhack`									.padEnd(8) +
			`$avail`									.padEnd(12) +
			`$max`										.padEnd(12) + 
			`difficulty`							.padEnd(12) +  
			`adminrights`							.padEnd(12) +
			`weaken/grow/hack times`	.padEnd(15) 
		)

		printHeaders()
		for( let serverData of sorted_servers )  {		
			let s = serverData.server // because fuck you keyboard
			
			let hasAdminRights = s.hasAdminRights? "ROOT":"----"

			let line_color = colors.reset
			if ( s.moneyMax === 0 ) line_color = colors.brightCyan
			
			let actions = data.server_actions.filter( a => a.hostname == serverData.hostname ).map( a => a.description )
			let flagString = actions.sort().join("")

			if ( flagString.length > 0 ) line_color = colors.brightMagenta

			ns.print ( 
				`${line_color}` + 
				`${s.hostname}`																					.padEnd(24) +
				flagString								    													.padEnd(8) +
				`${s.requiredHackingSkill}`															.padEnd(8) +
				`${toMillionsFormatted( s.moneyAvailable as number )}`	.padEnd(12) +
				`${toMillionsFormatted( s.moneyMax as number)}`					.padEnd(12) + 
				`${(s.hackDifficulty??-1).toFixed(0)}` 									.padEnd(6) +  
				`${s.minDifficulty}`																		.padEnd(6) + 
				`${hasAdminRights}(${s.numOpenPortsRequired??-1})`			.padEnd(12) // +
				/*`${toMinutes(s.weaken_time)}`														.padEnd(5) +
				`${toMinutes(s.grow_time)}`															.padEnd(5) +
				`${toMinutes(s.hack_time)}(m)`													.padEnd(5) */
			)
		}

		printHeaders()
		ns.print( Date.now())

		await ns.sleep( 200 )
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
