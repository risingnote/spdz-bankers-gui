/**
 * Utility functions to manage spdz proxy config state as immutable. 
 */
import { Map, List } from 'immutable'
import assert from 'assert'
import ProxyStatusCodes from './ProxyStatusCodes'

/**
 * Apply spdz server updates to the proxy list.
 * @param {spdzProxyList} Immutable List of proxy servers
 * @param {values} Array of {id status} to apply to spdzProxyList
 * @returns new Immutable list with updates applied
 */
const updateSpdzServerStatus = (spdzProxyList, values) => {

  assert.equal(spdzProxyList.size, values.length, 
    `Expecting the spdz proxy list ${spdzProxyList.size} to be the same length as the status list ${values.length}.`)

  return spdzProxyList.map( (spdzProxy, index) => {
      return spdzProxy.set(
        "status", values.find(element => element.id  === index).status
      )
    })
}    
 
 /**
  * Convert a json config into an immutable List structure and add a default status to each member.
  */
 const initSpdzServerList = (spdzProxyList) => {
   return List(
     spdzProxyList.map( (spdzProxy) => {
       return Map(spdzProxy).set(
         "status", ProxyStatusCodes.Disconnected
       )}
    )
  )
}

export { initSpdzServerList, updateSpdzServerStatus }
