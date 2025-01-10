import React, { useState } from 'react'
import { data } from '../global_data/GlobalData'
import { ServerData } from '../global_data/ServerData'


interface ServerListProps {
  servers: ServerData[]
}

export async function main(ns:NS) {

  ns.tail() 

  ns.printRaw( ServerList.toString() ) 
  
}

export const ServerList: React.FC<ServerListProps> = ({ servers }) => {
  const [filter, setFilter] = useState('')
  
  const filteredServers = servers.filter(server => 
    server.hostname.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Filter servers..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          width: '100%'
        }}
      />

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {filteredServers.map(server => (
          <div 
            key={server.hostname}
            style={{
              border: '1px solid #444',
              padding: '1rem',
              borderRadius: '4px'
            }}
          >
            <h3>{server.hostname}</h3>
            <div>Money: ${server.server.moneyAvailable?.toLocaleString()} / ${server.server.moneyMax?.toLocaleString()}</div>
            <div>Security: {server.server.hackDifficulty?.toFixed(1)} / {server.server.minDifficulty}</div>
            <div>Required Hacking: {server.server.requiredHackingSkill}</div>
            <div>RAM: {server.server.ramUsed?.toFixed(1)}GB / {server.server.maxRam}GB</div>
            <div>Root Access: {server.server.hasAdminRights ? 'Yes' : 'No'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
