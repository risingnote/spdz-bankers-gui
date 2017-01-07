/**
 * Display the diners table with names of diners from props.
 */
import React, { PropTypes } from 'react'

import './BankersTable.css'

const BankersTable = (props) => {
  // Build all places and populate with props.diners names, need index key (public key?)
  return (
    <div className='atable'>
      <div className='place' style={{transform: 'translate(0rem, -8.3rem) rotate(180deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-180deg)'}}>Me</div>
        </div>
      </div>

      <div className='place paying' style={{transform: 'translate(5.8rem, -5.8rem) rotate(225deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-225deg)'}}>Fred</div>
        </div>
      </div>

      <div className='place' style={{transform: 'translate(8.3rem, 0rem) rotate(270deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-270deg)'}}>Alice</div>
        </div>
      </div>

      <div className='place' style={{transform: 'translate(5.8rem, 5.8rem) rotate(315deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-315deg)'}}></div>
        </div>
      </div>

      <div className='place' style={{transform: 'translate(0rem, 8.3rem) rotate(0deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-0deg)'}}>Bob</div>
        </div>
      </div>

      <div className='place' style={{transform: 'translate(-5.8rem, 5.8rem) rotate(45deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-45deg)'}}></div>
        </div>
      </div>

      <div className='place' style={{transform: 'translate(-8.3rem, 0rem) rotate(90deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-90deg)'}}>Mal</div>
        </div>
      </div>

      <div className='place' style={{transform: 'translate(-5.8rem, -5.8rem) rotate(135deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-135deg)'}}></div>
        </div>
      </div>

    </div> 
  )
}

BankersTable.propTypes = {
  diners: PropTypes.array.isRequired
}

export default BankersTable
