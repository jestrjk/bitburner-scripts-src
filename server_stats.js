/* eslint-disable */
import * as lib_args from 'lib_argumentProcessor.js'

/** @param {NS} ns */
export async function main(ns) {
	let arg_data = lib_args.processArguments( ns ) 

	ns.tail( ns.pid )
	ns.moveTail( 1650, 0 )
	ns.resizeTail( 1100, 1050 )

	const million = 1000000

	let filter			= arg_data.args[0]
	let hacking_level_limit = arg_data.options.limit 

	let all_servers = [ ]
	get_servers( all_servers, 'home' )

	let filtered_servers = [] ;

	if (filter) {
		filtered_servers = all_servers.filter ( (server_name) => server_name.includes( filter ) )
	} else {
		filtered_servers = all_servers
	}


	while ( true ) {
		let mapped_filtered_servers = [] 
		mapped_filtered_servers = filtered_servers.map( (target) => {

			let max_money 				= ns.getServerMaxMoney( target )
			let available_money 	= ns.getServerMoneyAvailable( target ) 

			let min_security_level 	 	= ns.getServerMinSecurityLevel( target )
			let security_level				= ns.getServerSecurityLevel( target ).toFixed( 1 ) 

			let root_access						= ns.hasRootAccess( target ) ? "ROOT": ""
			let open_ports_required   = ns.getServerNumPortsRequired( target )


			let per_time = 1000 * 60 // minutes
			let weaken_time		= ( ns.getWeakenTime( target ) / per_time ).toFixed(1) 
			let grow_time			= ( ns.getGrowTime( target ) / per_time ).toFixed(1)
			let hack_time			= ( ns.getHackTime( target ) / per_time ).toFixed(1)

			let hacking_level_required = ns.getServerRequiredHackingLevel( target )
			
			return {
				target,
				hacking_level_required,
				max_money,
				available_money,
				min_security_level,
				security_level,
				weaken_time,
				grow_time,
				hack_time,
				root_access,
				open_ports_required,
			} })	

		let byHackingLevelLimit = ( server ) => ( server.hacking_level_required < hacking_level_limit ) 

		if ( hacking_level_limit ) { 
			mapped_filtered_servers =  mapped_filtered_servers.filter( byHackingLevelLimit ) 
		}

		let sorted_servers = mapped_filtered_servers.sort( 
			(a,b) => ( a.weaken_time - b.weaken_time) )

		let large_padding = 24
		let padding = 18
		let small_padding= 8 

		for( let server of sorted_servers )  {		
			let s = server // because fuck you keyboard
			ns.print ( 
				`$${( s.available_money/million ).toFixed(1)}/$${(s.max_money/million).toFixed( 1 )}`.padEnd( padding )  + 
				`SEC:${s.security_level}/${s.min_security_level}`.padEnd( padding ) + 
				`${s.root_access}(${s.open_ports_required})`.padEnd( padding ) +
				`WGH:${s.weaken_time}/${s.grow_time}/${s.hack_time}(m)`.padEnd( large_padding )  +
				`${s.target}`.padEnd( padding ) +
				`${s.hacking_level_required}`.padEnd( small_padding ) )
		}
		await ns.sleep( 1000 )
	}	// while(true)

	function get_servers( all_servers, target_server ) {

		let new_server_list = ns.scan( target_server )  

		for ( let new_target of new_server_list ) {
			if ( all_servers.includes( new_target )) continue ;

			all_servers.push( new_target )
			get_servers( all_servers, new_target, recurse_to )
		}

 } // get_servers
} // main()