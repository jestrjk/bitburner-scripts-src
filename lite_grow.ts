/* eslint-disable */
import {NS} from "./NetscriptDefinitions"

/** @param {NS} ns */
export async function main(ns: NS) {
try {
    let target  = ns.args[0] as string
    await ns.grow( target ) 
} catch (error) {
  throw error
}
}

