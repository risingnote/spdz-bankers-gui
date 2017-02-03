/**
 * Responsible for displaying SPDZ connection information based on props passed in.
 */
import React from 'react';
import { List } from 'immutable'
import ProxyStatus from './ProxyStatus'
import './Connection.css'

const Connection = (props) => {
  const proxyServers = (proxyServerList) => {
    return proxyServerList.map( (proxyServer) => {
      return <ProxyStatus key={proxyServer.get('url')} status={proxyServer.get('status')} url={proxyServer.get('url')} />
    })
  }

  return (
    <div className='Connection-panel'>
      <p className='Connection-subHead'>Spdz Proxy Servers</p>
      {proxyServers(props.spdzProxyServerList)}
    </div>
  )
} 

Connection.propTypes = {
  spdzProxyServerList: React.PropTypes.instanceOf(List).isRequired
}

export default Connection