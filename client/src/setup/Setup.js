/**
 * Responsible for displaying setup information based on props passed in.
 */
import React from 'react';
import './Setup.css'

const Setup = (props) => {
  return (
    <div>
        <button onClick={props.setupForRun}>
          Setup for SPDZ
        </button>
        <div className='Setup-status'>
          <span>Status Messages</span>
        </div>
    </div>
  )
} 

Setup.proptypes = {
  setupForRun: React.PropTypes.func.isRequired
}

export default Setup