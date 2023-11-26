/* eslint-disable */
import { NS, Server } from '../NetscriptDefinitions'
import * as lib_args from '../lib/argumentProcessor'
import { colors, toMillionsFormatted } from '../lib/utils'
import { ServerList } from '../lib/ServerList'

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
	ns.moveTail( 1450, 0 )
	ns.resizeTail( 1050, 600 )
	
	while ( true ) {
		let server_list = new ServerList(ns)
		let all_servers : Server[] = server_list.all_servers
		let mapped_servers = all_servers.map( (target_server) => map_server_data(target_server))	

		
		ns.clearLog()

		let byHackingLevelLimit = ( server: any ) => ( server.hacking_level_required < hacking_level_limit ) 

		if ( hacking_level_limit ) { 
			mapped_servers =  mapped_servers.filter( byHackingLevelLimit ) 
		}
		
		function sortByReqHackSkill_Ascending(a:any,b:any) { return ( a.requiredHackingSkill! - b.requiredHackingSkill!) }
		function sortByReqHackSkill_Descending(a:any,b:any) { return ( b.requiredHackingSkill! - a.requiredHackingSkill!) }
		
		let sorted_servers = mapped_servers.sort( sortByReqHackSkill_Ascending )

		let printHeaders = () => ns.print( 
			`hostname`								.padEnd( 24 ) +
			`reqhack`									.padEnd(8) +
			`$avail`									.padEnd(12) +
			`$max`										.padEnd(12) + 
			`difficulty`							.padEnd(12) +  
			`adminrights`							.padEnd(12) +
			`weaken/grow/hack times`	.padEnd(15) 
		)


		printHeaders()
		for( let server of sorted_servers )  {		
			let s = server // because fuck you keyboard
			
			let hasAdminRights = s.hasAdminRights? "ROOT":"----"

			let line_color = colors.reset
			if ( s.moneyMax === 0 ) line_color = colors.brightCyan
			
			ns.print ( 
				`${line_color}` + 
				`${s.hostname}`																					.padEnd( 24 ) +
				`${s.requiredHackingSkill}`															.padEnd(8) +
				`${toMillionsFormatted( s.moneyAvailable as number )}`	.padEnd(12) +
				`${toMillionsFormatted( s.moneyMax as number)}`					.padEnd(12) + 
				`${(s.hackDifficulty??-1).toFixed(0)}` 									.padEnd(6) +  
				`${s.minDifficulty}`																		.padEnd(6) + 
				`${hasAdminRights}(${s.numOpenPortsRequired??-1})`			.padEnd(12) +
				`${toMinutes(s.weaken_time)}`														.padEnd(5) +
				`${toMinutes(s.grow_time)}`															.padEnd(5) +
				`${toMinutes(s.hack_time)}(m)`													.padEnd(5)
			)
		}
		printHeaders()

		await ns.sleep( 1000 )
	}	// while(true)

	function map_server_data(target_server: Server) : Server_Info_Extended {
		let weaken_time		= ns.getWeakenTime( target_server.hostname )
		let grow_time			= ns.getGrowTime	( target_server.hostname )
		let hack_time			= ns.getHackTime	( target_server.hostname )
		
		return {
			...target_server,
			weaken_time,
			grow_time,
			hack_time,
		}
	}//map server

	/**
	 * pads the @text by @fixed_amount
	 * @param text the text to pad
	 * @param fixed_amount 
	 * @returns padded @text
	 */
	function pe( text: string, fixed_amount: number ) {
		return `${text.padEnd(fixed_amount)}`
	}

	function fixed( value: number, decimal_places: number ) {
		return `${value.toFixed( decimal_places )}`
	}
	
	function toMinutes( seconds: number ): string { return (seconds/1000/60).toFixed( 1 )}
} // main()

// FUNCTIONS
