import React, { Component } from 'react'
import ClassNames from 'classnames'

import cryptologo from './crypto-logo.png'
import uoblogo from './uob-logo-white-largest.png'
import spdzlogo from './spdz_logo.svg'
import './App.css'
import BankersWithConnection from './bankers_gui/BankersWithConnection'

class App extends Component {
  render() {
    const spdzLogoClass = ClassNames('App-header-fixed-col', 'App-spdzlogo')
    return (
      <div className="App">
        <header className="App-header">
          <a title="Bristol Crypt Group SPDZ software" href="https://www.cs.bris.ac.uk/Research/CryptographySecurity/SPDZ/">
            <img src={spdzlogo} className={spdzLogoClass} alt="SPDZ logo" />
          </a>        
          <h2 className="App-header-col">MPC Demonstrators</h2>
          <a title="University of Bristol homepage" href="http://www.bristol.ac.uk">
            <img src={uoblogo} className="App-header-fixed-col" alt="logo" />
          </a>      
        </header>
        <BankersWithConnection />
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
            <a title="Bristol Cryptography Group" href="http://www.cs.bris.ac.uk/Research/CryptographySecurity/">
              <img src={cryptologo} alt="logo" />
            </a>       
            <a href="http://www.bristol.ac.uk/web/policies/terms-conditions.html#copyright">© 2016 University of Bristol</a>
          </div>
        </footer>
      </div>
    )
  }
}

export default App;
