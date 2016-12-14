/**
 * Given a list of Uint8Array buffers, from each SPDZ proxy, holding 1 or more triples:
 *  Check buffers are expected length
 *  Convert to bigint triples.
 *  Add together and verify.
 *  Return list of first triple, still in montgomery format
 */
import SpdzConstants from '../setup/SpdzConstants'
import { fromSpdzBinary } from './binary'

const TRIPLE_BYTES =  3 * SpdzConstants.INTEGER_LENGTH_BYTES

const range = (length) => [...Array(length).keys()]

/**
 * Triple represents montgomery big ints [A, B, C]. 
 */
class Triple {
  constructor (byteBuffer) {
    this.a = fromSpdzBinary(byteBuffer.slice(0, SpdzConstants.INTEGER_LENGTH_BYTES))
    this.b = fromSpdzBinary(byteBuffer.slice(SpdzConstants.INTEGER_LENGTH_BYTES, 2*SpdzConstants.INTEGER_LENGTH_BYTES))
    this.c = fromSpdzBinary(byteBuffer.slice(2*SpdzConstants.INTEGER_LENGTH_BYTES, 3*SpdzConstants.INTEGER_LENGTH_BYTES))
  }
  checkRelation() {
    return this.a.add(this.b).mod(SpdzConstants.GFP_PRIME).equals(this.c) 
  }
  add(triple) {
    this.a = this.a.add(triple.a).mod(SpdzConstants.GFP_PRIME)
    this.b = this.b.add(triple.b).mod(SpdzConstants.GFP_PRIME)
    this.c = this.c.add(triple.c).mod(SpdzConstants.GFP_PRIME)
    return this
  }
}  

/**
 * Integers are supplied as 16 byte numbers so validate length of all spdz engine triples
 */
const checkBufferLength = ( (expectedNum, clearValues) => {
  const wrongLengthMsgs = clearValues.map((clearValue, index) => {
    return (clearValue.length === expectedNum * TRIPLE_BYTES ? '' :
      `Spdz proxy ${index} provided triple with ${clearValue.length} bytes, expected ${expectedNum * TRIPLE_BYTES}.`)
  })
  return wrongLengthMsgs.filter( message => message.length > 0).join('\n')
})

export default (expectedNum, byteBufferList) => {
  const errorMessage = checkBufferLength(expectedNum, byteBufferList)
  if (errorMessage.length > 0) {
    throw new Error(errorMessage)
  }

  return range(expectedNum).map((i) => {
    const combinedTriple = byteBufferList
      .map(byteBuffer => new Triple(byteBuffer.slice(i * TRIPLE_BYTES, (i + 1) * TRIPLE_BYTES)))
      .reduce((sumTriple, triple) => sumTriple.add(triple))

    if (!combinedTriple.checkRelation()) {
      throw new Error('Triple to be used for a share failed check.')
    }

    return combinedTriple.a
  })
}
