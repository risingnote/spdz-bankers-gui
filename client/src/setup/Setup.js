/**
 * Responsible for displaying setup information based on props passed in.
 */
import React from 'react';
import { List } from 'immutable'
import ProxyStatus from './ProxyStatus'
import './Setup.css'

const Setup = (props) => {
  const proxyServers = (proxyServerList) => {
    return proxyServerList.map( (proxyServer) => {
      return <ProxyStatus key={proxyServer.get('url')} status={proxyServer.get('status')} url={proxyServer.get('url')} />
    })
  }

  return (
    <div className='Setup-panel'>
      <p className='Setup-subHead'>Spdz Proxy Servers</p>
      <button onClick={props.setupForRun}>
        Connect
      </button>
      {proxyServers(props.spdzProxyServerList)}
    </div>
  )
} 

Setup.propTypes = {
  setupForRun: React.PropTypes.func.isRequired,
  spdzProxyServerList: React.PropTypes.instanceOf(List).isRequired
}

export default Setup