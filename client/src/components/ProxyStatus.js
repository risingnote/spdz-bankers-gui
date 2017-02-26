/**
 * Display the status and url of a SPDZ proxy
 */
import React, { PropTypes } from 'react';
import ClassNames from 'classnames'
import { ProxyStatusCodes } from 'spdz-gui-lib'
import './ProxyStatus.css'

const ProxyStatus = (props) => {
  const markerClass = ClassNames({
    'ProxyStatus-marker': true,
    'ProxyStatus-marker-disconnected': props.status === ProxyStatusCodes.Disconnected,
    'ProxyStatus-marker-connected': props.status === ProxyStatusCodes.Connected,
    'ProxyStatus-marker-failure': props.status === ProxyStatusCodes.Failure    
  })

  const urlCombinedStyle = Object.assign(
    {
      paddingLeft: '10px',
      fontSize: '12px'
    }, props.urlStyle)

  return (
    <div className='ProxyStatus'>
      <div className={markerClass} />
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
