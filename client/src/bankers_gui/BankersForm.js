/**
 * Responsible for managing local state on form before submit.
 */
import React, { Component } from 'react'

import './BankersForm.css'

class BankersForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bonus: '',
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
    this.props.submitBonus(this.state.participantName, this.state.bonus)
    this.setState({bonus: '', participantName: ''})
    event.preventDefault()
  }

  render() {
    const disableSubmit = this.props.proxiesConnected && !this.props.joinedName  ? '' : 'disabled'
    const statusMessage = () => {
      if (!this.props.proxiesConnected) return 'You must be connected to all SPDZ proxies.'
      else if (this.props.joinedName) return `You have joined the meal as ${this.props.joinedName}.`
      else return ''
    }

    return (
        <form className="BankersForm" onSubmit={this.handleSubmit}>
          <h4>Bankers Celebration Dinner</h4>
          <p>...but who should pay?</p>        
          <label htmlFor="joinName">Join meal as</label>
          <input type="text" id="joinName" value={this.state.participantName} onChange={this.handleNameChange} disabled={disableSubmit}/>
          <label htmlFor="bonusValue">Bonus</label>
          <input type="text" id="bonusValue" value={this.state.bonus} onChange={this.handleBonusChange} disabled={disableSubmit}/>
          <input type="submit" value="Send" disabled={disableSubmit}/>
          <p className='smallText'>{statusMessage()}</p>
        </form>
    )
  }
}

BankersForm.propTypes = {
  submitBonus: React.PropTypes.func.isRequired,
  proxiesConnected: React.PropTypes.bool.isRequired,
  joinedName: React.PropTypes.string
}

export default BankersForm
