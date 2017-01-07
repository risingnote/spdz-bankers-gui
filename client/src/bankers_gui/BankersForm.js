/**
 * Responsible for managing local state on form before submit.
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
    const proxyStatusMessage = (this.props.allProxiesConnected ? 'all connected' : 'not all connected')

    return (
      <form className="bankersForm" onSubmit={this.handleSubmit}>
        <label>Join meal as</label>
        <input type="text" value={this.state.participantName} onChange={this.handleNameChange} disabled={disableSubmit}/>
        <label>Bonus</label>
        <input type="text" value={this.state.bonus} onChange={this.handleBonusChange} disabled={disableSubmit}/>
        <input type="submit" value={submitText} disabled={disableSubmit}/>
        <p className='smallText'>Proxies {proxyStatusMessage}</p>
      </form>
    )
  }
}

BankersForm.propTypes = {
  submitBonus: React.PropTypes.func.isRequired,
  enableSubmit: React.PropTypes.bool.isRequired
}

export default BankersForm
