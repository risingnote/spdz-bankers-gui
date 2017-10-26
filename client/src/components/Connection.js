/**
 * Responsible for displaying SPDZ connection information based on props passed in.
 */
import React from 'react';
import { List } from 'immutable'

import ProxyStatus from './ProxyStatus'
import { generateProxyStatusList } from './ProxyStatusHelper'

const Connection = (props) => {
  const combinedComponentStyle = Object.assign(
    {
      padding: '0px 10px 5px 10px',
      border: '1px solid darkgrey',
      margin: '0 auto',
      textAlign: 'left'
    }, props.componentStyle)

  const combinedHeadingStyle = Object.assign(
    {
      fontSize: '16px',
      color: 'rgb(28, 118, 152)',
      marginRight: '10px'
    }, props.headerStyle)

  const proxyServers = (spdzProxyServerList, spdzProxyStatus) => {
    const proxyStatusForDisplay = generateProxyStatusList(spdzProxyServerList, spdzProxyStatus)
    return proxyStatusForDisplay.map( (proxyServer) => {
      return <ProxyStatus key={proxyServer.get('url')} status={proxyServer.get('status')} 
                url={proxyServer.get('url')} urlStyle={props.urlStyle} />
    })
  }

  return (
    <div style={combinedComponentStyle}>
      <p style={combinedHeadingStyle}>Spdz Proxy Servers</p>
      {proxyServers(props.spdzProxyServerList, props.spdzProxyStatus)}
    </div>
  )
} 

Connection.propTypes = {
  spdzProxyServerList: React.PropTypes.instanceOf(List).isRequired,
  spdzProxyStatus: React.PropTypes.array.isRequired,
  componentStyle: React.PropTypes.object,
  headerStyle: React.PropTypes.object,
  urlStyle: React.PropTypes.object
}

export default Connection