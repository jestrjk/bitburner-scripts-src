import { data } from "../global_data/GlobalData"

export async function main ( ns:NS ) {
  ns.tail()

  while (true) {
    ns.clearLog()

    // Sort actions by expiration time
    let sorted_actions = data.server.actions.sort((a, b) => a.expires - b.expires)

    // Print header
    ns.print("Server Actions:")
    ns.print("----------------------------------------")
    ns.print("Server               | Action | Time Remaining | Script Host | Threads")
    ns.print("----------------------------------------")

    // Print each action
    for (let action of sorted_actions) {
      let time_remaining = action.expires - Date.now()
      let time_str = `${Math.floor(time_remaining/1000)}s`
      ns.print(
        `${action.hostname.padEnd(20)} | ` + 
        `${action.description.padEnd(6)} | ` + 
        `${time_str.padEnd(7)} | ` + 
        `${action.script_host.padEnd(20)}` +
        `${action.threads}`) 
    }

    if (sorted_actions.length === 0) {
      ns.print("No active server actions")
    }

    await ns.sleep(1000)
  }

}