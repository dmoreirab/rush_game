//Requiring PageObjects
const BetObjects = require ('../PageObjects/bet_page_objects');
const CommonObjects = require('../PageObjects/common_page_objects');

//Instantiate PageObjects
var betObjects = new BetObjects();
var commonObjects = new CommonObjects();


//Functions




beforeEach(function() {
  cy.visit('/game')
})

describe('Testing Bets', function() {

  it('should have the confirm button disabled if stake is 0', function() {
    cy.get(betObjects.)
  })

  it('should place a bet', function() {
    cy.get(betObjects.tokenOne)
    .click()

    .then()    
    cy.get(betObjects.confirmBetButton)
    .click()
  })

  it('should clear a bet', function() {
  
  })

  it('should return the stake to a previous state', function() {
    
  })

  it('should add multiple and different tokens', function() {
  
  })
})