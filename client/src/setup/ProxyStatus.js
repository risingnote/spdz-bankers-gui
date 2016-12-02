/**
 * Display the status and url of a SPDZ proxy
 */
import React, { PropTypes } from 'react';
import ClassNames from 'classnames'
import ProxyStatusCodes from './ProxyStatusCodes'
import './ProxyStatus.css'

const ProxyStatus = (props) => {
  const markerClass = ClassNames({
    'ProxyStatus-col1': true,
    'ProxyStatus-marker-disconnected': props.status === ProxyStatusCodes.Disconnected,
    'ProxyStatus-marker-connected': props.status === ProxyStatusCodes.Connected,
    'ProxyStatus-marker-failure': props.status === ProxyStatusCodes.Failure    
  })
  return (
    <div className='ProxyStatus-row'>
      <div className={markerClass} />
      <div className={ClassNames('ProxyStatus-col2', 'smallText')}>
        {props.url}
      </div>
    </div>
  )
}

ProxyStatus.propTypes = {
  status: PropTypes.number.isRequired, 
  url: PropTypes.string.isRequired
}

export default ProxyStatus
