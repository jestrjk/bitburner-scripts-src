/* eslint-disable */
/** @typedef {import("./NetscriptDefinitions").NS} NS  */ 

export class PortManager {
  
  /** @param {NS} ns */
  constructor (ns) {
    this.ns     = ns
    this._count  = 0
  }

  /** @returns {number} */
  get count() { return this._count }
  set count(value) { this._count = value}
  
  readport() {
    this.count--
    return JSON.parse( this.ns.readPort(1).toString() )
  }

  /** @param {any} data */
  writeport(data) {
    this.ns.writePort( 1, JSON.stringify(data) )
    this.count++
  }
}

