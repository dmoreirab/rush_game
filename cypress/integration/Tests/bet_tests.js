//Requiring PageObjects
const BetObjects = require ('../../pageObjects/bet_page_objects');
const CommonObjects = require('../../pageObjects/common_page_objects');

//Instantiate PageObjects
var betObjects = new BetObjects();
var commonObjects = new CommonObjects();

//Pre-conditions
beforeEach(() => {
  cy.visit('/game')
})

//Functions
let betConfirmation = () => {
  cy
  .get(commonObjects.confirmingBetScreen)
  .should('be.visible')
  .get(commonObjects.betConfirmingText)
  .contains('Confirming bet...')
  .get(commonObjects.confirmationSpinner)
  .should('be.visible')
  .get(commonObjects.betAcceptedContainer)
  .should('be.visible')
  .get(commonObjects.betAcceptedIcon)
  .should('be.visible')
  .get(commonObjects.betAcceptedText)
  .contains('Bet Accepted')

  //verifying if the elements disappeared
  .get(commonObjects.confirmingBetScreen)
  .should('not.be.visible')
  .get(commonObjects.betAcceptedContainer)
  .should('not.be.visible')
}

let addAllTokens = () => {
  cy
  .get(betObjects.chipsContainer)
  .each(($el) => {
    cy
    .wrap($el)
    .click()
  })
}

//User can only bet if the BUST text is on game screen
let waitUntilUserCanBet = () => {
  cy
  .get(commonObjects.busted, { timeout: 120000 })
}

let tryToPlaceBet = () => {
  cy
  .get(betObjects.confirmBetButton)
  .click()
}

//User can only bet if the BUST text is on game screen
let waitUntilBettingPauses = () => {
  cy
  .get(betObjects.betPausedContainer, { timeout: 120000 })
}

let gameStarted = () => {
  cy
  .get(betObjects.betPausedContainer, { timeout: 120000 })
  .get(commonObjects.nextRoundTimer)
  .should('have.text', '0', { timeout: 120000 })
}

//Proper Tests
describe('Testing Bets', () => {

  it('should have the confirm button disabled if stake is 0', () => {
    waitUntilUserCanBet()
    cy
    .get(betObjects.stake)
    .should('have.text', '£0.00')
    tryToPlaceBet()
    
    cy
    .get(commonObjects.confirmingBetScreen)
    .should('not.be.visible')
  })

  it('should place a simple bet', () => {
    waitUntilUserCanBet()
    cy
    .get(betObjects.tokenOne)
    .click()
    tryToPlaceBet()

    //check for all the elements of confirmation
    betConfirmation() 
  })

  it('should clear a bet and verify that the confirm button is disabled', () => {
    waitUntilUserCanBet()
    cy
    .get(betObjects.tokenFive)
    .click()

    .get(betObjects.clearStake)
    .click()

    .get(betObjects.stake)
    .should('have.text', '£0.00')
    tryToPlaceBet()

    cy
    .get(commonObjects.confirmingBetScreen)
    .should('not.be.visible')
  })

  it('should add a token of every value to the stake', () => {
    waitUntilUserCanBet()
    addAllTokens()
    cy
    .get(betObjects.stake)
    .should('have.text', '£86.00')

    tryToPlaceBet()

    betConfirmation()
  })

  it('should return the stake to a previous state', () => {
    waitUntilUserCanBet()
    addAllTokens()
    cy
    .get(betObjects.stake)
    .should('have.text', '£86.00')

    tryToPlaceBet()
    betConfirmation()

    cy
    .get(betObjects.clearStake)
    .click()

    .get(betObjects.stake)
    .should('have.text', '£0.00')
  })

  it('should add multiple and different tokens', () => {
    addAllTokens()
    addAllTokens()
    addAllTokens()
    addAllTokens()
    cy
    .get(betObjects.stake)
    .should('have.text', '£344.00')
    waitUntilUserCanBet()
    tryToPlaceBet()

    betConfirmation()
  })

  it('should bust the game without placing bets and check elements', () => {
    waitUntilUserCanBet()
    cy
    .get(commonObjects.busted)
    .should('have.text', 'BUST')
    .get(commonObjects.placeBetTimer)
    .should('not.be.empty')
  })

  it('should warn the player when betting is paused', () => {
    cy
    .get(betObjects.betPausedContainer, { timeout: 120000 })
    
    .get(betObjects.betPausedUpperText)
    .should('have.text', 'Betting Paused!')
    .get(betObjects.betPausedBottomText)
    .should('have.text', 'Wait for current game to end')
    .get(betObjects.confirmBetButton)
    .should('not.be.visible')
  })

  it('should not allow the player to bet when betting is paused', () => {
    cy
    .get(betObjects.betPausedContainer, { timeout: 120000 })
    .get(betObjects.confirmBetButton)
    .should('not.be.visible')
  })

  it('should display timer for new bets when the game busts', () => {
    waitUntilUserCanBet()
    cy
    .get(commonObjects.placeBetTimerText)
    .should('be.visible')
    .contains('Place your bet in:')
  })

  it('should display timer when the game is about to start', () => {
    waitUntilUserCanBet()
    cy
    .get(commonObjects.nextRoundTimerText, { timeout: 120000 })
    .should('be.visible')
    .contains('Next Round Starts in:')
  })

  xit('should not display counters when the game is running', () => {
    gameStarted()
  })

  xit('should not display the bet tab when a bet was placed and the game is running', () => {
    
  })

  xit('should cash out the bet', () => {
    
  })

  xit('should cash out the bet', () => {
    
  })
})