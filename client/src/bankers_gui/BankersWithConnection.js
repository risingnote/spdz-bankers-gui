/**
 * Wrap Bankers GUI with higher order component to manage proxy server connections.
 * Wrapping separated out to simplify testing of BankersContainers. 
 */
import BankersContainer from './BankersContainer'
import ConnectionContainer from '../connection/ConnectionContainer'

export default ConnectionContainer(BankersContainer)