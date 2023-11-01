/* eslint-disable */
import {NS} from "./NetscriptDefinitions"

/** @param {NS} ns */
export async function main(ns) {
  let target: string  = ns.args[0] 
  await ns.hack( target )
}

