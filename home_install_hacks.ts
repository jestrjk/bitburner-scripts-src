/* eslint-disable */
import {NS, Server} from "./NetscriptDefinitions"
import {RootKit} from "./lib_Rooting"
import {colors} from "./lib_utils"

let lite_script_names = {
	weaken: "lite_weaken.js",
	grow: "lite_grow.js",
	hack: "lite_hack.js",
}

/** @param {NS} ns */
export async function main(ns : NS) {
	
	let script_host_name 		= "home"
	let host_max_ram   			= ns.getServerMaxRam( script_host_name )
	killRunningLiteScripts(ns, script_host_name ) ;

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
			
			// ns.print( `name: ${target_server_name} max_money ${target_max_money} cur money ${target_money}`)
			let growth_money_ratio   	= target_max_money / Math.max( target_money, 1 )
			let growth_threads 				= Math.max( Math.floor( ns.growthAnalyze( target_server_name, growth_money_ratio, ns.getServer().cpuCores )), 1 );

			let hack_threads   				= Math.max( Math.floor( ns.hackAnalyzeThreads(target_server_name, Math.floor( target_max_money*.50 ))) , 1)
			
			// ns.print( `${colors.brightYellow}` +
				// `${target_server_name}`.padEnd( 12 ) + 
				// `m: $${(target_money/1000000).toFixed(1)}/$${(target_max_money/1000000).toFixed(1)} ` +
				// `sec: ${target_current_security}/${target_min_security} ` +
				// `wa: ${weaken_amount} gmr: ${growth_money_ratio} ga: ${growth_threads} ht: ${hack_threads}`)

			let weaken_threads = 100 ; // TODO TODO TODO Fix this to dynamic calc

			let run_script_params_partial = {
				target_host_name: target_server_name,
				script_host_name,
				host_max_ram,
			}

			if (!isLiteScriptRunning( target_server_name )) {
				if ( target_current_security >= 10 + target_min_security ) {
					run_script( run_script_params_partial, lite_script_names.weaken, weaken_threads ) 
				}

				if ( target_money < .95 * target_max_money ) {
					run_script( run_script_params_partial, lite_script_names.grow, growth_threads ) 
				} 

				run_script( run_script_params_partial, lite_script_names.hack, hack_threads ) 
			}

			await ns.sleep( 100 ) 
		} // for target_servers 

		ram_usage.unshift( ns.getServerUsedRam( script_host_name ) )
		while ( ram_usage.length > 20 ) ram_usage.pop()
		let total_ram_usage   = ram_usage.reduce( (prev,cur) => (prev+cur) )
		let average_ram_usage =  total_ram_usage / ram_usage.length

		// ns.print( `RAM USE AVERAGE: ${average_ram_usage.toFixed(1)} of ${host_max_ram} free: ${host_max_ram - ns.getServerUsedRam( script_host_name )}`)

	

		await ns.sleep ( 1000 )
	} // while true

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
	
	function run_script( run_script_params_partial, script_name, threads_required )	 {

				let { target_host_name, script_host_name, host_max_ram} = run_script_params_partial

				if ( hostHasEnoughRam( script_host_name, host_max_ram, script_name, threads_required ) ) {
					if ( threads_required < 0 ) return 

					ns.run(script_name, threads_required, target_host_name )
					return true ;
				} else {
					// ns.print( `${script_host_name} does not have enough ram to run ${threads_required} threads of ${script_name}`)
					
					// let single_script_ram_required = ns.getScriptRam( script_name, script_host_name )
					// let threaded_script_ram_required = single_script_ram_required*threads_required
					// let host_memory_used = ns.getServerUsedRam(script_host_name) 
					// let host_memory_available = host_max_ram - host_memory_used

					while ( (threads_required = Math.floor( threads_required / 2 ) ) > 1 && !hostHasEnoughRam( script_host_name, host_max_ram, script_name, threads_required ) ) {}

					// ns.print( `${colors.brightRed}Downgraded threads_required to ${threads_required}`)

					if ( threads_required < 1 ) threads_required = 1
					if ( hostHasEnoughRam( script_host_name, host_max_ram, script_name, threads_required ) ) {
						ns.run(script_name, threads_required, target_host_name )
						return true
					} else {
						// ns.print( `${colors.brightRed}${script_host_name} does not have enough ram to run ${threads_required} threads of ${script_name}`)
					}
					return false ;
				}

				throw "Problems in run_script - should not get to the end."
	}
	
	function hostHasEnoughRam( script_host_name, host_max_ram, script_name, threads ) {
		let ram_per_thread = ns.getScriptRam(script_name, script_host_name) 
		
		if ( ram_per_thread * threads < host_max_ram - ns.getServerUsedRam( script_host_name ) ) {
			return true ; 
		} else { return false }
	}

	function isLiteScriptRunning(target_host_name) {
			let proc_list = ns.ps(script_host_name)
			let lite_script_is_running = proc_list.some( (proc)=>proc.filename.startsWith( "lite_" ) && proc.args[0] == target_host_name )

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

} // main

function killRunningLiteScripts(ns: NS, script_host_name: string) {
	ns.ps(script_host_name)
	.filter( (proc) => (proc.filename.startsWith( "lite_" ) ) )
	.forEach( (proc) => ns.kill( proc.pid ) )
}
