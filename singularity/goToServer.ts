import { NS } from "../NetscriptDefinitions";
import { ServerPath} from "../lib/ServerPath";

export async function main(ns:NS) {
  let pather = new ServerPath(ns,ns.getHostname(), ns.args[0].toString())

  pather.goToTarget()
}