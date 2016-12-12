/**
 * Higher level functioins to interact with the SPDZ api.
 * 
 * TODO implement reading and writing of data
 * How handle long poll ?
 * See https://davidwalsh.name/javascript-polling for polling with promises, i.e. wait for data.
 * Think about api like readShares, writeIntegers, readIntegers with params (encrypt (true/false), count) )
 * 
 */
import { connectProxyToEngine } from './SpdzApi'
import ProxyStatusCodes from '../setup/ProxyStatusCodes'

/**
 * Run connection setup on all spdz proxy servers for this client.
 * No throws or rejects expected.
 *  
 * @param {spdzProxyList} Immutable list of maps, with map containing key of url
 * @returns Promise which is thenable once all connection setup requests are finished.
 *          Returns a list of objects with id and status. 
 */
const connectToSpdzProxies = (spdzProxyList, spdzApiRoot, clientId) => {
  
  const connectList = spdzProxyList.map( (value, index) => {
    return connectProxyToEngine(value.get('url'), spdzApiRoot, clientId) 
      .then((connectLocation) => {
        return {id: index, status: ProxyStatusCodes.Connected}
      }, (ex) => {
        console.log('Unable to successfully run connection setup.', (ex.reason ? ex.reason.message : ex.message))
        return {id: index, status: ProxyStatusCodes.Failure}        
      })
  })

  return Promise.all(connectList)
}
 
export default connectToSpdzProxies
