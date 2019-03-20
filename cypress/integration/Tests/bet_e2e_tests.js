//Requiring PageObjects
const BetObjects = require ('../PageObjects/bet_page_objects');
const CommonObjects = require('../PageObjects/common_page_objects');

//Instantiate PageObjects
var betObjects = new BetObjects();
var commonObjects = new CommonObjects();

beforeEach(function() {
  cy.visit(commonObjects.appURL)
})

describe('Testing Bets', function() {
  it('should place a bet', function() {
    cy.get(betObjects.tokenOne)
    .click()

    .then()    
    cy.get(betObjects.confirmBetButton)
    .click()
  })
})