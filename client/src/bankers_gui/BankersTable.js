/**
 * Display the diners table with names of diners from props and whose paying if any.
 */
import React, { PropTypes } from 'react'
import ClassNames from 'classnames'

import './BankersTable.css'

const BankersTable = (props) => {

  const getDinerName = (position => {
    return (position < props.diners.length ? props.diners[position].name : '')
  })

  const placeClass = (position => {
    return ClassNames({
      'place': true,
      'paying': (position < props.diners.length && props.diners[position].paying)
    })
  })

  return (
    <div className='BankersTable'>
      <div className={placeClass(0)} style={{transform: 'translate(0rem, -8.2rem) rotate(180deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-180deg)'}}>{getDinerName(0)}</div>
        </div>
      </div>

      <div className={placeClass(4)} style={{transform: 'translate(5.8rem, -5.8rem) rotate(225deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-225deg)'}}>{getDinerName(4)}</div>
        </div>
      </div>

      <div className={placeClass(2)} style={{transform: 'translate(8.2rem, 0rem) rotate(270deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-270deg)'}}>{getDinerName(2)}</div>
        </div>
      </div>

      <div className={placeClass(5)} style={{transform: 'translate(5.8rem, 5.8rem) rotate(315deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-315deg)'}}>{getDinerName(5)}</div>
        </div>
      </div>

      <div className={placeClass(1)} style={{transform: 'translate(0rem, 8.2rem) rotate(0deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-0deg)'}}>{getDinerName(1)}</div>
        </div>
      </div>

      <div className={placeClass(6)} style={{transform: 'translate(-5.8rem, 5.8rem) rotate(45deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-45deg)'}}>{getDinerName(6)}</div>
        </div>
      </div>

      <div className={placeClass(3)} style={{transform: 'translate(-8.2rem, 0rem) rotate(90deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-90deg)'}}>{getDinerName(3)}</div>
        </div>
      </div>

      <div className={placeClass(7)} style={{transform: 'translate(-5.8rem, -5.8rem) rotate(135deg)'}}>
        <div className='place-setting'>
          <div style={{transform: 'rotate(-135deg)'}}>{getDinerName(7)}</div>
        </div>
      </div>

    </div> 
  )
}

BankersTable.propTypes = {
  diners: PropTypes.array.isRequired
}

export default BankersTable
