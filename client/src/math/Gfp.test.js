import BigInt from 'big-integer'
import Gfp from './Gfp'

describe('Map integers into Gfp finite field and convert between native and montgomery format', () => {
  it('converts native to montgomery and back', () => {
    const nativeGfp = Gfp.fromString('123456789')

    const montgGfp = nativeGfp.toMontgomery()
    expect(montgGfp.isMontgomery()).toBeTruthy()

    const nativeGfpAgain = montgGfp.fromMontgomery()
    expect(nativeGfpAgain.isMontgomery()).toBeFalsy()

    expect(nativeGfpAgain).toEqual(nativeGfp)
  })

  it('converts a known montgomery number', () => {
    const montGfp = Gfp.fromString('50197844390672583818590000880091070221', true)
    expect(montGfp.fromMontgomery()).toEqual(Gfp.fromString('123'))
  })

  it('adds 2 native numbers', () => {
    const a = Gfp.fromString('12')
    const b = Gfp.fromString('16')
    const c = Gfp.fromString('28')

    expect(a.add(b)).toEqual(c)
  })

  it('adds 2 montgomery numbers', () => {
    const a = Gfp.fromString('12').toMontgomery()
    const b = Gfp.fromString('16').toMontgomery()
    const c = Gfp.fromString('28').toMontgomery()

    expect(a.add(b)).toEqual(c)
  })
  
  it('multiplies 2 native numbers', () => {
    const a = Gfp.fromString('12')
    const b = Gfp.fromString('16')
    const c = Gfp.fromString('192')

    expect(a.multiply(b)).toEqual(c)
  })

  it('multiplies 2 montgomery numbers', () => {
    const a = Gfp.fromString('12').toMontgomery()
    const b = Gfp.fromString('16').toMontgomery()
    const c = Gfp.fromString('192').toMontgomery()

    expect(a.multiply(b)).toEqual(c)
  })

  it('checks for equality correctly', () => {
    expect( (Gfp.fromString('12345')).equals(Gfp.fromString('12345')) ).toBeTruthy()
    expect( (Gfp.fromString('99', true)).equals(Gfp.fromString('99', true)) ).toBeTruthy()    
    expect( (Gfp.fromString('44')).equals(Gfp.fromString('45')) ).toBeFalsy()
    expect( (Gfp.fromString('99', false)).equals(Gfp.fromString('99', true)) ).toBeFalsy()
    expect( (new Gfp(BigInt('99'), false)).equals('why am I here') ).toBeFalsy()
  })
})
