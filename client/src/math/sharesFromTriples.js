/**
 * Given a list of Uint8Array buffers, from each SPDZ proxy, holding 1 or more triples:
 *  Check buffers are expected length
 *  Convert to Gfp triples.
 *  Add together and verify.
 *  Return list of first triple, Gfp still in montgomery format
 */
import { fromSpdzBinary } from './binary'
import Gfp from './Gfp'

const TRIPLE_BYTES =  3 * Gfp.integerLengthBytes()

const range = (length) => [...Array(length).keys()]

/**
 * Triple represents montgomery Gfps [A, B, C]. 
 */
class Triple {
  constructor (byteBuffer) {
    this.a = fromSpdzBinary(byteBuffer.slice(0, Gfp.integerLengthBytes()), true)
    this.b = fromSpdzBinary(byteBuffer.slice(Gfp.integerLengthBytes(), 2*Gfp.integerLengthBytes()), true)
    this.c = fromSpdzBinary(byteBuffer.slice(2*Gfp.integerLengthBytes(), 3*Gfp.integerLengthBytes()), true)
  }
  static zero() {
    return new Triple(new Uint8Array(3*Gfp.integerLengthBytes()))
  }
  checkRelation() {
    return this.a.multiply(this.b).equals(this.c)
  }
  add(triple) {
    this.a = this.a.add(triple.a)
    this.b = this.b.add(triple.b)
    this.c = this.c.add(triple.c)
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
      .reduce((sumTriple, triple) => sumTriple.add(triple), Triple.zero())

    if (!combinedTriple.checkRelation()) {
      throw new Error('Triple to be used for a share failed check.')
    }

    return combinedTriple.a
  })
}
