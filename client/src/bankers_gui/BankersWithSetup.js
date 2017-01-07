/**
 * Wrap Bankers GUI with higher order component to manage proxy server connections.
 * Wrapping separated out to simplify testing of BankersContainers. 
 */
import BankersContainer from './BankersContainer'
import SetupContainer from '../setup/SetupContainer'

export default SetupContainer(BankersContainer)