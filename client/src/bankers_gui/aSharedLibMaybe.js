    /**
     * Try to connect to SPDZ servers at start of 'game'.
     */
    setupSpdzConnections() {
      if (this.state.spdzProxyList.size === 0) {
          console.log('No point trying to setup connect and poll spdz proxies, none found.')
          return
      }
      this.connectionTimerId = setInterval(() => {
        const allConnected = allProxiesConnected(this.state.spdzProxyList)

        const connectionPromise = (allConnected) ? 
            checkProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                                this.state.spdzApiRoot, this.state.clientPublicKey) :
            connectToProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                                this.state.spdzApiRoot, this.state.clientPublicKey)

        connectionPromise                                
            .then( (values) => {
              const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, values)
              this.setState({spdzProxyList: proxyListAfterUpdate}) 
            })
            .catch( (ex) => {
              // Really not expecting this
              console.log('Got an exception in setup/poll status of spdz proxies.', ex)
              clearInterval(this.connectionTimerId)
            })
            
      }, 5000)
    }

    /**
     * Start an interval timer to maintain connection to SPDZ proxies.
     * If not connected, try connecting. 
     * If already connected, check connection status.
     */
    setupAndPollSpdzConnections() {
      if (this.state.spdzProxyList.size === 0) {
          console.log('No point trying to setup connect and poll spdz proxies, none found.')
          return
      }
      this.connectionTimerId = setInterval(() => {
        const allConnected = allProxiesConnected(this.state.spdzProxyList)

        const connectionPromise = (allConnected) ? 
            checkProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                                this.state.spdzApiRoot, this.state.clientPublicKey) :
            connectToProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                                this.state.spdzApiRoot, this.state.clientPublicKey)

        connectionPromise                                
            .then( (values) => {
              const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, values)
              this.setState({spdzProxyList: proxyListAfterUpdate}) 
            })
            .catch( (ex) => {
              // Really not expecting this
              console.log('Got an exception in setup/poll status of spdz proxies.', ex)
              clearInterval(this.connectionTimerId)
            })
            
      }, 5000)
    }

    /**
     * Send a close command to each SPDZ proxy to indicate game is over (connection may already be ended.)
     * Stop polling connection status.
     */
    stopSpdzConnections() {
      if (this.state.spdzProxyList.size === 0) {
          return
      }
      clearInterval(this.connectionTimerId)

      disconnectFromProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                          this.state.spdzApiRoot, this.state.clientPublicKey)
        .then( (values) => {
          const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, values)
          this.setState({spdzProxyList: proxyListAfterUpdate}) 
        })
        .catch( (ex) => {
          // Really not expecting this
          console.log('Got an exception in setup/poll status of spdz proxies.', ex)
          clearInterval(this.connectionTimerId)              
        })
    }
