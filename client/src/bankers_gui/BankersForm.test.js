import React from 'react'
import renderer from 'react-test-renderer'

import BankersForm from './BankersForm'

describe('Bankers Form display component rendering', () => {
  it('Renders as expected (compared to a snapshot) start of game.', () => {

    const tree = renderer.create(
      <BankersForm submitBonus={()=>{}} joinedName={undefined} winnerChosen={undefined} resetGame={()=>{}} connectionProblem={undefined} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Renders as expected (compared to a snapshot) start of game, no proxies.', () => {

    const tree = renderer.create(
      <BankersForm submitBonus={()=>{}} joinedName={undefined} winnerChosen={undefined} resetGame={()=>{}} connectionProblem={'No proxies found.'} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Renders as expected (compared to a snapshot) after user has joined game.', () => {

    const tree = renderer.create(
      <BankersForm submitBonus={()=>{}} joinedName={'Bob'} winnerChosen={undefined}  resetGame={()=>{}} connectionProblem={undefined}/>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Renders as expected (compared to a snapshot) after winner has been chosen.', () => {

    const tree = renderer.create(
      <BankersForm submitBonus={()=>{}} joinedName={'Bob'} winnerChosen={true}  resetGame={()=>{}} connectionProblem={undefined}/>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

})
