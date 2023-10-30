
const percent = 1/100;

/**
 * A class to generate and hold all the servers in this city and their characteristics.
 */
export class ServerList {
  /**
   * ctor
   * 
   * @param {NS} ns the Netscript library
   */
  constructor( ns ) {
    this.ns = ns

    this.all_server_names = []
    this.getAllServerNames()

    this.all_servers = this.all_servers.map( (server_name) =>  getServerData(this.ns, server_name) )
    this.ns.tprint( Math.floor( this.all_servers.length * Math.random()))
  }

  /**
   * gets the server names
   * 
   * @param {string} target The target to start the scan from
   */
  getAllServerNames( target = 'home' ) {
    
    let new_servers = this.ns.scan( target )

    for ( let new_server of new_servers ) {
      this.ns.tprint( `new server ${new_server}`)
      if ( this.all_server_names.includes( new_server ) ) {
        continue
      } else {
        this.all_server_names.push(new_server) 
        this.getAllServerNames( new_server )
      }
    }

    return this 
  }


  tprint( keys ){
    for( let srv of this.all_servers) {
      this.ns.tprint( `${ms(srv.name)} ${s(s.required_level_to_hack)}}`) 
    }
  }
  
}

function s( str) { return str.padEnd( 8 )}
function ms( str) { return str.padEnd( 12 )}
function m( str) { return str.padEnd( 16 )}
function ml( str) { return str.padEnd( 24 )}
function l( str) { return str.padEnd( 32 )}

/** @param {NS} ns */
function getServerData( ns, target ) {

  let data = ns.getServer(target)

  let max_server_money = ns.getServerMaxMoney( target )
  let current_script_threads = ns.ps( ns.pid )[0].threads

  return {
    data,
    hack: {
      money_from_single_thread:       ns.hackAnalyze( target ),
      hack_success_chance:            ns.hackAnalyzeChance(target),
      threads_to_hack_half_max_money: ns.hackAnalyzeThreads(target, 50*percent * max_server_money ),
      required_level_to_hack:         ns.getServerRequiredHackingLevel( target ),
    },
    weaken: {
      security_decrease: ns.weakenAnalyze(current_script_threads,data.cpuCores ),
      time_required: ns.getWeakenTime( target ),
    },
    grow: {
      time_required: ns.getGrowTime( target ),
      //b: ns.share()

    } 
  }
}
  
