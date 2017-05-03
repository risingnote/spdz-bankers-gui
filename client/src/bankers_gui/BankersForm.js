/**
 * Responsible for managing local state on form before submit.
 */
import React, { Component, PropTypes } from 'react'

import './BankersForm.css'

class BankersForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bonus: '',
      participantName: '',
      finished: false
    }
    this.handleBonusChange = this.handleBonusChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleFinishedChange = this.handleFinishedChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleBonusChange(event) {
    this.setState({bonus: event.target.value})
  }

  handleNameChange(event) {
    this.setState({participantName: event.target.value})
  }

  handleFinishedChange(event) {
    this.setState({finished: event.target.checked})
  }

  handleSubmit(event) {
    this.props.submitBonus(this.state.participantName, this.state.bonus, this.state.finished)
    this.setState({bonus: '', participantName: '', finished: false})
    event.preventDefault()
  }

  render() {
    const disableSubmit = this.props.joinedName === undefined && this.props.connectionProblem === undefined ? '' : 'disabled'
    const statusMessage = () => {
      if (this.props.connectionProblem !== undefined) return this.props.connectionProblem
      else if (this.props.winnerChosen) return `A winner has been chosen.`
      else if (this.props.joinedName !== undefined) return `You have joined the meal as ${this.props.joinedName}.`
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

          <label className="BankersForm-inline" htmlFor="finished">All Joined</label>
          <input className="BankersForm-inline" type="checkbox" id="finished" checked={this.state.finished} onChange={this.handleFinishedChange} disabled={disableSubmit}/>

          <input type="submit" value="Send" disabled={disableSubmit}/>
          <p className='smallText'>{statusMessage()}</p>
        </form>
    )
  }
}

BankersForm.propTypes = {
  submitBonus: PropTypes.func.isRequired,
  joinedName: PropTypes.string,
  winnerChosen: PropTypes.bool,
  connectionProblem: PropTypes.string
}

export default BankersForm
