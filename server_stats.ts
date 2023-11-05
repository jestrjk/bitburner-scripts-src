/* eslint-disable */
import { NS, Server } from './NetscriptDefinitions'
import * as lib_args from './lib_argumentProcessor'
import {getAllServersAndNames} from './lib_ServerList'
import { toMillionsFormatted } from './lib_utils'

interface Server_Info_Extended extends Server {
	weaken_time: number
	grow_time: number
	hack_time: number
}

/** @param {NS} ns */
export async function main(ns : NS) {
	let arg_data = lib_args.processArguments( ns ) 
	let hacking_level_limit = arg_data.options.limit 

	ns.tail( ns.pid )
	ns.moveTail( 1450, 0 )
	ns.resizeTail( 1050, 800 )

	let { all_servers, all_server_names } = await getAllServersAndNames(ns, 'home')
	
	while ( true ) {
		let mapped_servers = all_servers.map( (target_server) => map_server_data(target_server))	

		let byHackingLevelLimit = ( server: any ) => ( server.hacking_level_required < hacking_level_limit ) 

		if ( hacking_level_limit ) { 
			mapped_servers =  mapped_servers.filter( byHackingLevelLimit ) 
		}

		let sorted_servers = mapped_servers.sort( (a,b) => ( a.weaken_time - b.weaken_time) )

		let large_padding = 24
		let padding = 18
		let small_padding= 8 
		
		ns.clearLog()

		for( let server of sorted_servers )  {		
			let s = server // because fuck you keyboard
			ns.print ( 
				`${( toMillionsFormatted( s.moneyAvailable as number ))}/${toMillionsFormatted(s.moneyMax as number)}`.padEnd( large_padding )  + 
				`SEC:${(s.hackDifficulty??-1).toFixed(1)}/${s.minDifficulty}`.padEnd( padding ) + 
				`${s.hasAdminRights? "ROOT":"----"}(${s.numOpenPortsRequired??-1})`.padEnd( padding ) +
				`WGH:${toMinutes(s.weaken_time)}/${toMinutes(s.grow_time)}/${toMinutes(s.hack_time)}(m)`.padEnd( large_padding )  +
				`${s.hostname}`.padEnd( padding ) +
				`${s.requiredHackingSkill}`.padEnd( small_padding ) )
		}
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