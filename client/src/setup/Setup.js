/**
 * Responsible for displaying setup information based on props passed in.
 */
import React from 'react';
import './Setup.css'

const Setup = (props) => {
  const proxyServers = (proxyServerList) => {
    return proxyServerList.map( (proxyServer) => {
      return <p key={proxyServer.key}>{proxyServer.url}</p>
    })
  }

  return (
    <div>
        <button onClick={props.setupForRun}>
          Setup for SPDZ
        </button>
        <div className='Setup-status'>
          <h4>Spdz Proxy Servers</h4>
          {proxyServers(props.spdzProxyServerList)}
        </div>
    </div>
  )
} 

Setup.proptypes = {
  setupForRun: React.PropTypes.func.isRequired,
  spdzProxyServerList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
}

export default Setup