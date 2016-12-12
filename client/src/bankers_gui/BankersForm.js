import React, { Component } from 'react'

import './BankersForm.css'

class BankersForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bonus: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({bonus: event.target.value})
  }

  handleSubmit(event) {
    this.props.submitBonus(this.state.bonus)
    event.preventDefault()
  }

  render() {
    const disableSubmit = this.props.enableSubmit ? '' : 'disabled'
    const submitText = this.props.enableSubmit ? 'Send' : 'Send (disabled)'
    //Should set css alsou
    return (
      <form className="BankersForm" onSubmit={this.handleSubmit}>
        <label>
          Bonus:
          <input type="text" value={this.state.bonus} onChange={this.handleChange} disabled={disableSubmit}/>
        </label>
        <input type="submit" value={submitText} disabled={disableSubmit}/>
      </form>
    )
  }
}

BankersForm.propTypes = {
  submitBonus: React.PropTypes.func.isRequired,
  enableSubmit: React.PropTypes.bool.isRequired
}

export default BankersForm
