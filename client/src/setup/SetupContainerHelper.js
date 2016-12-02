/**
 * Utility functions to manage spdz proxy config state as immutable. 
 */
import { Map, List } from 'immutable'
import ProxyStatusCodes from './ProxyStatusCodes'

/**
 * Given an immutable list of spdz proxy servers, update the status at position index.
 */
const updateSpdzServerStatus = (spdzProxyList, index, status) => {
  return spdzProxyList.update(index, (spdzProxy) => { 
    return spdzProxy.set(
      "status", status
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
