/**
 * Finite field size and prime are assumed, must match values used in SPDZ engines.
 */
import BigInt from 'big-integer'

const gfpPrime = BigInt('172035116406933162231178957667602464769')

const spdzConstants = {
  INTEGER_LENGTH_BYTES: 16,
  GFP_PRIME: gfpPrime
}

export default spdzConstants 