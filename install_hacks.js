/* eslint-disable */

/** @param {NS} ns */
export async function main(ns) { 

	// Helper Classes
	class PortHackingPrograms {
		constructor() {

			this.program_list = [
				"BruteSSH.exe",
				"FTPCrack.exe",
				"relaySMTP.exe",
				"HTTPWorm.exe",
				"SQLInject.exe",
			]

			this.active_programs = [] ;

			this.get_active_programs() ;
		}

		get_active_programs() {
			for ( const program_name of this.program_list ) {
			
				if ( ns.fileExists( program_name ) ) {
					ns.tprint( `[port_hacking] adding ${program_name}`)
					this.active_programs.push ( program_name ) 
				} else { ns.tprint( `[port_hacking] Can't find ${program_name}`)} 
		
			}
		}	

		run( server ) {
			for ( const program_name of this.active_programs ) {
				switch ( program_name ) {
					case "BruteSSH.exe":
						ns.brutessh( server )
						break;
					case "FTPCrack.exe":
						ns.ftpcrack( server )
						break;
					case "relaySMTP.exe":
						ns.relaysmtp( server )
						break;
					case "HTTPWorm.exe":
						ns.httpworm( server )
						break;
					case "SQLInject.exe":
						ns.sqlinject( server )
						break;
					default:
						throw new Error( `[${server}] Invalid program name to execute: ${program_name} `)
				}
			}
		}
	} // /-PortHacking Class-/

	// main() code

  const giga 	= 1000000000 
  const billion	= 1000000000 
  const million = 1000000 

	let port_hacking_programs = new PortHackingPrograms();

  let params = {
		prepared_already: [ "home" ],
		script_runners: [ ],
		hacking_script:   "hack.js",
	}
	
	let depth_max = ns.args[0] || 1
	let depth_current = 0

	var fixed_target = ns.args[1]
	
	log ( "main()", `Killing script_runners ${params.script_runners}`)
	kill_script_runners() ;
	
	log( "main()", `Depth of scan: ${depth_max}` )

		
	await prepare( depth_current, depth_max, "home", params )
	log ( "COUNT", params.prepared_already.length )

	// ---------------------
	// ---------------------

	function kill_script_runners (){
		for ( let script_runner of params.script_runners ) {
			ns.killall( script_runner )
		}
	}

	async function prepare( depth_current, depth_max, root_server, params) {

		params.prepared_already.push( root_server ) 
		depth_current++ ;

		debug_log( root_server, `depth: ${depth_current}/${depth_max}`)
		if ( depth_current > depth_max ) {
			debug_log( `Depth exceeded, backing up`)
			return
		}

		let servers = ns.scan(root_server)
		for ( const server of servers ) {

			debug_log( server, `Copying ${params.hacking_script} to ${server}`)
			if ( ! ns.scp( params.hacking_script, server ) ) { throw `[${server}] ERROR: Could not copy` }
			
			if ( params.prepared_already.includes( server ) ) { 
				debug_log( `${root_server} already prepared - skipping` )
				continue
			} 
			
			await prepare( depth_current, depth_max, server, params ) 
			reset_and_hack_server( server, params )

			await ns.sleep( 200 )
		}		
	}

	function reset_and_hack_server( server, params ) {
		debug_log( server, `reset_and_hack_server: ${server}` )

		if ( !ns.hasRootAccess( server ) ) {

			log( server, `Getting Root access` ) 

			get_root_access( server, params ) 
			if ( !ns.hasRootAccess( server ) ) { 
				log( server, `Could not get root accesss`)
				return
			}

		} else {
			debug_log( ( server, `Root Accessed` ) )
		}

		let scripts = ns.ps( server )
		let scripts_string = scripts.join( " " )

		debug_log( server, `Killing: ${scripts_string}`)
		ns.killall( server ) 

		start_hacking( server ) 
	}

	function start_hacking ( server ) {

		let server_max_ram = ns.getServerMaxRam(server) 
		let server_max_money = ns.getServerMaxMoney( server )

		debug_log( server, `Starting HACK on ${server}[${server_max_ram}gb]`)

		if ( server_max_money <= 100000 )	{ 
			log ( server, `Cannot generate money, skipping`) 
			if ( server_max_ram >= 8 ) {
				log ( server, `has ${server_max_ram}gb: Adding to script_runners`) 
				ns.killall( server ) // Kill all scripts on script_runner server
				params.script_runners.push( server ) ;
			}
			return
		}

		var script_target = fixed_target || server
		log( server, `set target [${script_target}]`)

		if ( server_max_ram >= 4 ) { 
			hack_normal_server( server, script_target)
		}
	}

	function hack_normal_server( server, script_target ) {

		let script_memory_required 	= ns.getScriptRam( params.hacking_script, server)
		let max_memory 							= ns.getServerMaxRam( server )
		let threads 								= Math.floor( max_memory / script_memory_required )
		
		log( server, `${threads} threads of script ${params.hacking_script}(${script_memory_required}gb) on ${server}(${max_memory}gb)`)

		let target_server = fixed_target || server 
		ns.exec( params.hacking_script, server, threads, script_target, ns.getServerMaxMoney( script_target ), ns.getServerMinSecurityLevel( script_target ) )

	}

	function get_available_script_runner() {
		for ( let script_runner of params.script_runners ) {
			let available_ram = ns.getServerMaxRam( script_runner ) - ns.getServerUsedRam( script_runner ) ;
			if ( available_ram > 8 ) {
				return script_runner ;	
			}
		}

		return undefined
	}

	function get_root_access ( server ) {

		let active_port_hacking_programs_count = port_hacking_programs.active_programs.length 
			
			let ports_required = ns.getServerNumPortsRequired(server)
			if ( active_port_hacking_programs_count >= ports_required )
			{
				port_hacking_programs.run( server )
		

				ns.nuke( server )
				return true
			} else {
				log( server, `Can't hack enough ports ${active_port_hacking_programs_count}/${ports_required}`)
				return false
			}

		return false 
	}

	function log ( server, message ) {
		let formatted_message = `[${server}] ${message}`
		debug_log( server, message ) 
		ns.tprint ( formatted_message )
	}

	function debug_log ( server, message ) {
		let formatted_message = `[${server}] ${message}`
		ns.print( formatted_message )
		console.log ( formatted_message )
	}

	// /-function main()-/
}

