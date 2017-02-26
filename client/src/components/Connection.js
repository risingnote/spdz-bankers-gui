/**
 * Responsible for displaying SPDZ connection information based on props passed in.
 */
import React from 'react';
import { List } from 'immutable'
import ProxyStatus from './ProxyStatus'

const Connection = (props) => {
  const combinedComponentStyle = Object.assign(
    {
      padding: '10px',
      paddingTop: '0',
      border: '1px solid darkgrey',
      margin: '0 auto',
      textAlign: 'left'
    }, props.componentStyle)

  const combinedHeadingStyle = Object.assign(
    {
      color: 'rgb(28, 118, 152)',
      marginRight: '10px'
    }, props.headerStyle)

  const proxyServers = (proxyStatusList) => {
    return proxyStatusList.map( (proxyServer) => {
      return <ProxyStatus key={proxyServer.get('url')} status={proxyServer.get('status')} 
                url={proxyServer.get('url')} urlStyle={props.urlStyle} />
    })
  }

  return (
    <div style={combinedComponentStyle}>
      <p style={combinedHeadingStyle}>Spdz Proxy Servers</p>
      {proxyServers(props.proxyStatusForDisplay)}
    </div>
  )
} 

Connection.propTypes = {
  proxyStatusForDisplay: React.PropTypes.instanceOf(List).isRequired,
  componentStyle: React.PropTypes.object,
  headerStyle: React.PropTypes.object,
  urlStyle: React.PropTypes.object
}

export default Connection