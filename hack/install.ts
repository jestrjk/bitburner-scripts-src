/* eslint-disable */
import {NS, Server} from "../NetscriptDefinitions"
import {RootKit} from "../lib/RooKit"
import {colors, disableNSFunctionLogging} from "../lib/utils"
import {ServerList} from "../lib/ServerList"

let hack_script_names = {
	weaken: "hack/weaken.js",
	grow: "hack/grow.js",
	hack: "hack/hack.js",
}

export async function main(ns:NS) {
	ns.tail()
	ns.moveTail( 250, 0 )
	ns.resizeTail( 450, 300)
	
	disableNSFunctionLogging(ns)

	let arg_target_servers = ns.args.map(arg=>ns.getServer(arg as string))
	ns.print(`arg_target_servers: ${JSON.stringify( arg_target_servers.map(s=>s.hostname))}`)

	await ns.sleep( 5000 )
	while ( true ) {
		let server_lists = new ServerList(ns)
		let all_servers = server_lists.all_servers
		let all_server_names 			= all_servers.map( s=>s.hostname )

		let target_servers: Server[] = []

		if ( arg_target_servers.length > 0 ) {
			target_servers = arg_target_servers
		} else {
			target_servers = all_servers
		}

		ns.print( `target_servers: ${JSON.stringify( target_servers.map(s=>s.hostname))}`)

		let script_hosts 		  	= server_lists.script_hosts
		ns.print( JSON.stringify( script_hosts, null, 1))
		let script_host_names 	= script_hosts.map(s=>s.hostname)

		for ( let target_server of target_servers ) {
			root_server(ns, target_server )			
		}
	
		// Start da haxoring!
		for( let target_server of target_servers ) {
			//ns.clearLog()
						
			if ( !target_server.hasAdminRights ) continue;

			let target_server_name = target_server.hostname

			for ( let script_host_name of server_lists.all_servers.map(s=>s.hostname) ) {

				if ( ! ns.serverExists( script_host_name ) ) { ns.print( `[${target_server.hostname}] ${script_host_name} does not exist`); continue; }

				let target_max_money 			=	ns.getServerMaxMoney( target_server_name )
				if ( target_max_money <= 0 ) continue ;
	
				let target_money 							=	ns.getServerMoneyAvailable( target_server_name )
				
				let target_min_security 			= ns.getServerMinSecurityLevel( target_server_name )
				let target_current_security 	= ns.getServerSecurityLevel( target_server_name ) 
	
				ns.print( `[${target_server_name}] ${colors.brightCyan}Entering script conditions` )
				// Script conditions
				if ( target_current_security >= 10 + target_min_security ) {
					let weaken_time 						= ns.getWeakenTime( target_server_name )
					let weaken_amount 					= ns.weakenAnalyze(100, target_server.cpuCores )
					let weaken_threads 					= 100 ; 		// TODO TODO TODO Fix this to dynamic calc

					exec_script( script_host_name, target_server_name, hack_script_names.weaken, weaken_threads, weaken_time  ) 
				} else { 
					ns.print( `[${target_server.hostname}] ${colors.yellow}growth hack conditions not met`)
				}

				if ( target_money < .95 * target_max_money ) {
					let grow_time 							= ns.getGrowTime( target_server_name)
					let growth_money_ratio   		= target_max_money / Math.max( target_money, 1 )
					let growth_threads 					= Math.max( Math.floor( ns.growthAnalyze( target_server_name, growth_money_ratio, ns.getServer(script_host_name).cpuCores )), 1 );
					
					exec_script( script_host_name, target_server_name, hack_script_names.grow, growth_threads, grow_time ) 
				} else{ ns.print( `[${target_server.hostname}] ${colors.yellow}growth hack conditions not met`)}
				
				if ( target_money >= .95 * target_max_money ) {
					let hack_time 			= ns.getHackTime( target_server_name )
					let hack_threads   = Math.max( Math.floor( ns.hackAnalyzeThreads(target_server_name, Math.floor( target_max_money*.50 ))) , 1)
					
					exec_script( script_host_name, target_server_name, hack_script_names.hack, hack_threads, hack_time ) 
				} else{ ns.print( `[${target_server.hostname}] ${colors.yellow}money hack conditions not met`)}
			}

		} // for target_servers 

		await ns.asleep ( 10 )
	} // while true


	// ------- Function Definitions -------

	// function defs main->fn
	
	/** 
	 * @param script_host_name 		Server (host) that the script runs on
	 * @param target_server_name 	Server to attack
	 * @param script_name					Filename of script to run
	 * @param threads_required		Threads required for script to execute criteria in one run
	 * @param time_required       Amount of seconds it will take for the action of the script to finish
	 */
	function exec_script( script_host_name: string, target_server_name: string, 
		script_name: string, threads_required: number, time_required: number = -1 ):boolean	 {

		if ( ns.scriptRunning( script_name, script_host_name )) {
			if ( ns.ps( script_host_name ).some( (script_host_proc) => { 
				return (
					(script_host_proc.filename == script_name) &&
					(script_host_proc.args.includes( target_server_name ))
				)})
			) {
				return false
			}
		}

		let host_max_ram   			= ns.getServerMaxRam( script_host_name )

		let adjusted_thread_count = adjustThreadCount( ns, script_host_name, host_max_ram, script_name, threads_required )
		if ( adjusted_thread_count < 1 ) {
			ns.print( `[${target_server_name}] ${colors.brightRed}[${host_max_ram}] Not enough memory`)
			return false
		}

		ns.exec(script_name, script_host_name, adjusted_thread_count, target_server_name, Date.now(), time_required )
		return true ;
	}

	function adjustThreadCount( ns: NS, script_host_name: string, host_max_ram: number, script_name: string, threads: number ) {

		let used_ram = ns.getServerUsedRam( script_host_name )
		let ram_per_thread = ns.getScriptRam(script_name, script_host_name) 

		while ( !hostHasEnoughRam( ram_per_thread, host_max_ram, used_ram, threads)) {
			if ( threads < 3 ) return -1
			threads /= 2
		}

		return Math.floor( threads ) //adjusted thread count due to ram available
	}
	
	function hostHasEnoughRam( ram_per_thread: number, host_max_ram: number, used_ram: number,  threads: number ) {
		if ( (ram_per_thread * threads) < ( host_max_ram - used_ram  ) ) {
			return true ; 
		} else { return false }
	}
	
	

	function isLiteScriptRunning(script_host_name: string) {
			let proc_list = ns.ps(script_host_name)
			let lite_script_is_running = proc_list.some( (proc)=>
				( proc.filename.startsWith( "lite_" ) 
				&& proc.args[0] == script_host_name ))

			return lite_script_is_running
	}
	
	function root_server( ns: NS, target_server: Server ) {
		if ( target_server.hasAdminRights ) { return true } else {
			let root_kit = new RootKit(ns, target_server ) 
			let rooted = root_kit.run()
			ns.print( `[${target_server.hostname}] rooted: ${rooted}` )
			target_server = ns.getServer(target_server.hostname)
			
			if ( target_server.hasAdminRights ) { return true } else {
				console.log ( `${colors.brightRed} skipping ${target_server.hostname} - could not root kit it`)
				return false
			} 
		}
		//no reach
	}

	function killRunningLiteScripts(ns: NS, script_host_name: string) {
		ns.ps(script_host_name)
		.filter( (proc) => (proc.filename.startsWith( "lite_" ) ) )
		.forEach( (proc) => ns.kill( proc.pid ) )
	}

} // main
	
	