/**
 * Wrap Bankers GUI with higher order component to manage proxy server connections.
 * Separated out to simplify testing. 
 */
import BankersContainer from './BankersContainer'
import SetupContainer from '../setup/SetupContainer'

export default SetupContainer(BankersContainer)