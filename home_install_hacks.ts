/* eslint-disable */
import {NS, Server} from "./NetscriptDefinitions"
import {RootKit} from "./lib_Rooting"
import {colors} from "./lib_utils"

let script_host_names = [ "home", "script-host-1", "script-host-2" ]

let lite_script_names = {
	weaken: "lite_weaken.js",
	grow: "lite_grow.js",
	hack: "lite_hack.js",
}

/** @param {NS} ns */
export async function main(ns : NS) {

	for( let script_host_name of script_host_names) {
		if ( ns.serverExists( script_host_name ) ) {
			killRunningLiteScripts(ns, script_host_name ) ;
		}
	}

	let target_server_names = [] 
	getServerNames(target_server_names, 'home')

	ns.tail()

	let ram_usage = [ 1 ]
	while ( true ) {
		for( let target_server_name of target_server_names ) {
			ns.clearLog()

			let target_server 				= ns.getServer( target_server_name ) 

			if ( root_server( ns, target_server ) ) {} else continue

			// ns.print( `${target_server_name}: hasadmin? ${ns.hasRootAccess( target_server_name )}`)

			let target_max_money 			=	ns.getServerMaxMoney( target_server_name )
			if ( target_max_money <= 0 ) continue ;

			let target_money 							=	ns.getServerMoneyAvailable( target_server_name )
			let target_min_security 			= ns.getServerMinSecurityLevel( target_server_name )
			let target_current_security 	= ns.getServerSecurityLevel( target_server_name ) 

			let weaken_amount 						= ns.weakenAnalyze(100, target_server.cpuCores )
			let weaken_threads = 100 ; 		// TODO TODO TODO Fix this to dynamic calc
			
			// ns.print( `name: ${target_server_name} max_money ${target_max_money} cur money ${target_money}`)
			let growth_money_ratio   	= target_max_money / Math.max( target_money, 1 )
			let growth_threads 				= Math.max( Math.floor( ns.growthAnalyze( target_server_name, growth_money_ratio, ns.getServer().cpuCores )), 1 );

			let hack_threads   				= Math.max( Math.floor( ns.hackAnalyzeThreads(target_server_name, Math.floor( target_max_money*.50 ))) , 1)
			
			for ( let script_host_name of script_host_names ) {
				if ( !ns.serverExists( script_host_name ) ) continue;

				if (!isLiteScriptRunning( script_host_name )) {
					if ( target_current_security >= 10 + target_min_security ) {
						let weaken_time 	= ns.getWeakenTime( target_server_name )
						exec_script( script_host_name, target_server_name, lite_script_names.weaken, weaken_threads, weaken_time ) 
					}

					if ( target_money < .95 * target_max_money ) {
						let grow_time 		= ns.getGrowTime( target_server_name)
						exec_script( script_host_name, target_server_name, lite_script_names.grow, growth_threads, grow_time ) 
					} 
					
					let hack_time 			= ns.getHackTime( target_server_name )
					exec_script( script_host_name, target_server_name, lite_script_names.hack, hack_threads, hack_time ) 
				}
			}

			await ns.sleep( 100 ) 
		} // for target_servers 

		await ns.sleep ( 1000 )
	} // while true
	
	

		throw "Problems in run_script - should not get to the end."

		// function defs main->fn
		
		/** 
		 * @param script_host_name 		Server (host) that the script runs on
		 * @param target_server_name 	Server to attack
		 * @param script_name					Filename of script to run
		 * @param threads_required		Threads required for script to execute criteria in one run
		 * @param time_required       Amount of seconds it will take for the action of the script to finish
		 */
		function exec_script( script_host_name: string, target_server_name: string, 
			script_name: string, threads_required: number, time_required: number = -1 )	 {
	
			let host_max_ram   			= ns.getServerMaxRam( script_host_name )
			

			if ( hostHasEnoughRam( script_host_name, host_max_ram, script_name, threads_required ) ) {
				if ( threads_required < 0 ) return 

				ns.exec(script_name, script_host_name, threads_required, target_server_name, Date.now(), time_required )
				return true ;
			} else {
				return false ;
			}
		}

		function hostHasEnoughRam( script_host_name, host_max_ram, script_name, threads ) {
			let ram_per_thread = ns.getScriptRam(script_name, script_host_name) 
			
			if ( ram_per_thread * threads < host_max_ram - ns.getServerUsedRam( script_host_name ) ) {
				return true ; 
			} else { return false }
		}
	
		function isLiteScriptRunning(script_host_name) {
				let proc_list = ns.ps(script_host_name)
				let lite_script_is_running = proc_list.some( (proc)=>
					( proc.filename.startsWith( "lite_" ) 
					&& proc.args[0] == script_host_name ))
	
				return lite_script_is_running
		}
		
		function getServerNames( all_servers, target_server ) {
	
			let new_server_list = ns.scan( target_server )  
	
			for ( let new_target of new_server_list ) {
				if ( all_servers.includes( new_target )) continue ;
	
				all_servers.push( new_target )
				getServerNames( all_servers, new_target )
			}
	
		 } // get_servers
	
		function root_server( ns: NS, target_server: Server ) {
			if ( target_server.hasAdminRights ) { return true } else {
				let root_kit = new RootKit(ns, target_server ) 
				root_kit.run()
				target_server = ns.getServer(target_server.hostname)
				
				if ( target_server.hasAdminRights ) { return true } else {
					console.log ( `skipping ${target_server.hostname} - could not root kit it`)
					return false
				} 
			}
		}

		function killRunningLiteScripts(ns: NS, script_host_name: string) {
		ns.ps(script_host_name)
		.filter( (proc) => (proc.filename.startsWith( "lite_" ) ) )
		.forEach( (proc) => ns.kill( proc.pid ) )
	}

} // main
	
	