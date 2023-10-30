/** @param {NS} ns */
export async function main(ns) {

		let server_list = [
			"foodnstuff",
			"joesguns",
			"iron-gym",
		]

		let y_size = 200 ;
		let current_y = 0 ;
		for ( const server of server_list ) {

			let info = ns.ps( server )[0]
			ns.tprint( info ) 

			ns.tail( info.filename, server, ...info.args )
			ns.moveTail( 1600, current_y, info.pid )
			ns.resizeTail( 800, y_size, info.pid )

			current_y += y_size
		}
}