import React, { Component } from 'react'

import { setupWrapper } from 'spdz-gui-components'
import cryptologo from './crypto-logo.png'
import uoblogo from './uob-logo-white-largest.png'
import spdzlogo from './spdz_logo.svg'
import './App.css'
import BankersGUI from './bankers_gui/BankersGUI'

const GuiWithSetup = setupWrapper(BankersGUI, '/bankers/spdzProxyConfig')

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <a title="Bristol Crypt Group SPDZ software" href="https://www.cs.bris.ac.uk/Research/CryptographySecurity/SPDZ/">
            <img src={spdzlogo} className='App-spdzlogo' alt="SPDZ logo" />
          </a>
          <h4>Bankers Bonus Demonstrator</h4>           
        </div>
        <GuiWithSetup />
        <footer className="App-footer">
          <div className="App-footer-col-left">
          <a title="University of Bristol homepage" href="http://www.bristol.ac.uk">
            <img src={uoblogo} className="App-header-fixed-col" alt="logo" />
          </a>      
          </div>
          <div className="App-footer-col-right">  
            <a title="Bristol Cryptography Group" href="http://www.cs.bris.ac.uk/Research/CryptographySecurity/">
              <img src={cryptologo} alt="logo" />
            </a>       
          </div>
        </footer>
      </div>
    )
  }
}

export default App;
