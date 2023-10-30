/** @param {NS} ns */
export async function main(ns) {

	let all_servers = [] ;

	scan( all_servers, 'home' ) 

	function scan(all_servers, target_server) {

		all_servers.push( target_server );

		let scanned_servers = ns.scan( target_server ) 

		for( let new_server of scanned_servers ) {
			if ( all_servers.includes( new_server ) ) {
				continue;
			} else {
				scan( all_servers, new_server )
			}
		}	
	}



}