/**
 * Display the status and url of a SPDZ proxy
 */
import React, { PropTypes } from 'react';
import { ProxyStatusCodes } from 'spdz-gui-lib/dist/rest_api'

const ProxyStatus = (props) => {
  // Styles are all inline to avoid having to use webpack css loaders.
  const proxyStatusStyle = {
    display: 'flex',
    flexFlow: 'row wrap',
    margin: '0px 0px 10px 0px'
  }
    
  const statusColour = (status) => {
    if (status === ProxyStatusCodes.Connected) {
      return 'lightgreen'
    }
    else if (status === ProxyStatusCodes.Failure) {
      return 'lightcoral'
    }
    else {
      return 'lightgrey'
    }
  }
    
  const proxyStatusMarkerStyle = {
    width: '20px',
    borderRadius: '50%',
    border: '1px solid black',
    backgroundColor: statusColour(props.status)
  }

  const urlCombinedStyle = Object.assign(
    {
      paddingLeft: '10px',
      fontSize: '14px'
    }, props.urlStyle)

  return (
    <div style={proxyStatusStyle}>
      <div style={proxyStatusMarkerStyle} />
      <div style={urlCombinedStyle}>
        {props.url}
      </div>
    </div>
  )
}

ProxyStatus.propTypes = {
  status: PropTypes.number.isRequired, 
  url: PropTypes.string.isRequired,
  urlStyle: React.PropTypes.object
}

export default ProxyStatus
