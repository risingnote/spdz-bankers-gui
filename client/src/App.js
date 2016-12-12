import React, { Component } from 'react'
import cryptologo from './crypto-logo.png'
import uoblogo from './uob-logo-white-largest.png'
import './App.css'
import BankersWithSetup from './bankers_gui/BankersWithSetup'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a title="University of Bristol homepage" href="http://www.bristol.ac.uk">
            <img src={uoblogo} className="App-header-fixed-col" alt="logo" />
          </a>        
          <h2 className="App-header-col">SPDZ Demonstrators</h2>
          <a title="Bristol Cryptography Group" href="http://www.cs.bris.ac.uk/Research/CryptographySecurity/">
            <img src={cryptologo} className="App-header-fixed-col" alt="logo" />
          </a>          
        </header>
        <BankersWithSetup />
        <footer className="App-footer">
          <div className="App-footer-col-left">
            <h4>Department of Computer Science</h4>
            <p>University of Bristol</p>
            <p>Department of Computer Science</p>
            <p>Merchant Venturers Building</p>
            <p>Woodland Road</p>
            <p>Bristol BS8 1UB UK</p>
            <p>+44 (0)117 331 5663</p>
          </div>
          <div className="App-footer-col-right">     
            <a href="http://www.bristol.ac.uk/web/policies/terms-conditions.html#copyright">© 2016 University of Bristol</a>
          </div>
        </footer>
      </div>
    )
  }
}

export default App;
