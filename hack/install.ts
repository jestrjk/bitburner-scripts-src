/* eslint-disable */
import {NS, Server} from "../NetscriptDefinitions"
import {colors, disableNSFunctionLogging} from "../lib/utils"
import { DataBroker } from "../global_data"

let hack_script_names = {
	weaken: "hack/weaken.js",
	grow: "hack/grow.js",
	hack: "hack/hack.js",
}

export interface ErrOptions {
	ns:NS
	script_host_name:string
	target_server_name:string
}

export async function main(ns:NS) {
	ns.tail()
	ns.moveTail( 250, 0 )
	ns.resizeTail( 450, 300)
	
	disableNSFunctionLogging(ns)

	//let arg_target_servers = ns.args.map(arg=>ns.getServer(arg as string))
	// ns.print(`arg_target_servers: ${JSON.stringify( arg_target_servers.map(s=>s.hostname))}`)
	
	let broker = new DataBroker() 

	await ns.sleep( 2000 )
	while ( true ) {
		//let server_lists = broker.all_servers
		let all_servers = () => broker.all_servers
		let all_server_names 			= all_servers().map( s=>s.hostname )

		let target_servers: Server[] = []

		// if ( arg_target_servers.length > 0 ) {
		// 	target_servers = arg_target_servers
		// } else {
			target_servers = all_servers()
		//}

		ns.print( `target_servers: ${JSON.stringify( target_servers.map(s=>s.hostname))}`)

		let script_hosts 		  	= all_servers().filter(h=>h.hasAdminRights && ((h.maxRam-h.ramUsed) > 16))
		ns.print(`INFO Script Hosts ${script_hosts.length}/${broker.script_hosts.length}`)
		script_hosts.sort( (a,b)=>a.maxRam-b.maxRam )
		await ns.sleep( 1000 )

		// Start da haxoring!
		for( let target_server of target_servers ) {
			//ns.clearLog()
						
			if ( !target_server.hasAdminRights ) continue;

			let target_server_name = target_server.hostname

			for ( let script_host of script_hosts ) {

				let script_host_name = script_host.hostname

				if ( ! ns.serverExists( script_host_name ) ) { 
					ns.print( `[${target_server.hostname}] ${script_host_name} does not exist`); 
					continue; 
				}

				let target_max_money 			=	ns.getServerMaxMoney( target_server_name )
				if ( target_max_money <= 0 ) continue ;
	
				let target_money 							=	ns.getServerMoneyAvailable( target_server_name )
				
				let target_min_security 			= ns.getServerMinSecurityLevel( target_server_name )
				let target_current_security 	= ns.getServerSecurityLevel( target_server_name ) 
	
				ns.print( `[${script_host_name}] checking ${target_server_name}` )
				
				let errOptions:ErrOptions = {
					ns,
					script_host_name,
					target_server_name
				} 
				
				let server_analysis					= broker.getAnalysisData(target_server_name)

				// Script conditions
				if ( target_current_security >= 10 + target_min_security ) {
					let weaken_time 						= ns.getWeakenTime( target_server_name )
					let weaken_amount 					= server_analysis.weakenAnalyseData
					let weaken_threads 					= 100 ; 		// TODO TODO TODO Fix this to dynamic calc

					exec_script( script_host, script_hosts, target_server_name, hack_script_names.weaken, weaken_threads, weaken_time  ) 
				} else { err( errOptions, "weaken()" ) }

				if ( target_money < .95 * target_max_money ) {

					let grow_time 							= server_analysis.growtimeData
					let growth_money_ratio   		= target_max_money / Math.max( target_money, 1 )
					let growth_threads 					= server_analysis.growthAnalyzeData
					
					exec_script( script_host, script_hosts, target_server_name, hack_script_names.grow, growth_threads, grow_time ) 
				} else{ err( errOptions, "grow()" )}
				
				if ( target_money >= .95 * target_max_money ) {
					let hack_time 			= ns.getHackTime( target_server_name )
					let hack_threads   = Math.max( Math.floor( ns.hackAnalyzeThreads(target_server_name, Math.floor( target_max_money*.50 ))) , 1)
					
					exec_script( script_host, script_hosts, target_server_name, hack_script_names.hack, hack_threads, hack_time ) 
				} else{ err( errOptions, "hack()")}

				await ns.sleep(50) // sanity sleep
			}
			ns.print( `${colors.white}End script hosts`)
			await ns.sleep ( 100 )
		} // for target_servers 
		ns.print(`${colors.white}End target servers `)
		await ns.sleep ( 100 )
	} // while true


	// ------- Function Definitions -------

	// function defs main->fn
	
	function exec_script( script_host: Server, script_hosts: Server[], target_server_name: string, 
		script_name: string, threads_required: number, time_required: number = -1 ):boolean	 {

		if ( ns.scriptRunning( script_name, script_host.hostname )) {
			for( let script_host of script_hosts) {
				if ( ns.ps( script_host.hostname )
					.some( (script_host_proc) => { 
						return (
							(script_host_proc.filename == script_name) &&
							(script_host_proc.args.includes( target_server_name ))
						)})
				) {
					return false
				}
			}
		}

		let host_max_ram   			= ns.getServerMaxRam( script_host.hostname )
		let adjusted_thread_count = adjustThreadCount( ns, script_host.hostname, host_max_ram, script_name, threads_required )
		if ( adjusted_thread_count < 1 ) {
			err( {ns,target_server_name,script_host_name: script_host.hostname}, `host OOM: ${host_max_ram}`)
			return false
		}

		ns.exec(script_name, script_host.hostname, adjusted_thread_count, target_server_name, Date.now(), time_required )
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

	function err( opts:ErrOptions, msg:string ){ 
		opts.ns.print(`ERROR [${opts.script_host_name}]=>[${opts.target_server_name}] ${msg}`) 
	}
} // main
	
	