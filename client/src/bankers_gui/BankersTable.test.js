import React from 'react'
import renderer from 'react-test-renderer'

import BankersTable from './BankersTable'

describe('Bankers Table display component rendering', () => {
  it('Renders as expected (compared to a snapshot) 3 diners, none paying', () => {

    const tree = renderer.create(
      <BankersTable diners={[{name: 'me'}, {name: 'Alice'}, {name: 'Bob'}]}/>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Renders as expected (compared to a snapshot) 5 diners, 1 paying', () => {

    const tree = renderer.create(
      <BankersTable diners={[{name: 'me', publicKey: 'aaa'}, {name: 'Alice', publicKey: 'bbb'},
                             {name: 'Bob', publicKey: 'ccc'}, {name: 'Mal', publicKey: 'ddd'}, {name: 'Rich', publicKey: 'eee'}]}
                    winningClientId={'eee'}/>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

})
