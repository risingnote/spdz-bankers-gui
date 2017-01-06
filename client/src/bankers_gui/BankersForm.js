/**
 * Responsible for managing local state on form before submit.
 * TODO move display table into separate component 
 */
import React, { Component } from 'react'

import './BankersForm.css'

class BankersForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bonus: 0,
      participantName: ''
    }
    this.handleBonusChange = this.handleBonusChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleBonusChange(event) {
    this.setState({bonus: event.target.value})
  }

  handleNameChange(event) {
    this.setState({participantName: event.target.value})
  }

  handleSubmit(event) {
    this.props.submitBonus(this.state.bonus)
    event.preventDefault()
  }

  render() {
    const disableSubmit = this.props.enableSubmit ? '' : 'disabled'
    const submitText = this.props.enableSubmit ? 'Send' : 'Send (disabled)'
    //Diners transform is (radius.sinØ, -radiuscosØ)
    return (
      <div className='diners'>
        <form className="bankersForm" onSubmit={this.handleSubmit}>
          <label>Join meal as</label>
          <input type="text" value={this.state.participantName} onChange={this.handleNameChange} disabled={disableSubmit}/>
          <label>Bonus</label>
          <input type="text" value={this.state.bonus} onChange={this.handleBonusChange} disabled={disableSubmit}/>
          <input type="submit" value={submitText} disabled={disableSubmit}/>
        </form>

        <div className='atable'>
          <div className='aplace' style={{transform: 'translate(0rem, -6.8rem)'}}>
            Me
          </div>
          <div className='aplace' style={{transform: 'translate(4.8rem, -4.8rem)'}}>
            Fred
          </div>
          <div className='aplace' style={{transform: 'translate(6.8rem, 0rem)'}}>
            Sue
          </div>
          <div className='aplace' style={{transform: 'translate(0rem, 6.8rem)'}}>
            Bob
          </div>
          <div className='aplace' style={{transform: 'translate(-6.8rem, 0rem)'}}>
            Malmo
          </div>
        </div> 
      </div>
    )
  }
}

BankersForm.propTypes = {
  submitBonus: React.PropTypes.func.isRequired,
  enableSubmit: React.PropTypes.bool.isRequired
}

export default BankersForm
