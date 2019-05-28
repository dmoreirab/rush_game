//Requiring PageObjects
const BetObjects = require ('../../pageObjects/bet_page_objects');
const CommonObjects = require('../../pageObjects/common_page_objects');
const NumpadObjects = require('../../pageObjects/numpad_page_objects');

//Instantiate PageObjects
var betObjects = new BetObjects();
var commonObjects = new CommonObjects();
var numpadObjects = new NumpadObjects();

beforeEach(() => {
  cy.clearCookies() 
  cy.clearLocalStorage() 
  cy.viewport('iphone-5')
  cy.visit('rush/game?token=uVLReTuvKKpkH10WeYPOG3XdB3fvucVQi8LmWRtwWtObWKKs11KwnLPJfRDeXEeLocIzUHSX9D4ZcgpRBqaAmw6H0RJpnyttpC1lgO599wsDUph5tneh5ahJsLRYp2Vs&currency=EUR&language=') 
  
  .get(commonObjects.howToPlayButton)
  .click()
  .get(commonObjects.howToPlaySkipButton)
  .click()
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
  .get(commonObjects.placeBetTimerText, { timeout: 120000 })
  
}

let waitUntilUserCanBetOnNewRound = () => {
  cy
  .get(commonObjects.placeBetTimerText, { timeout: 120000 })
  .get(commonObjects.nextRoundTimerText)
  .should('not.exist')
  .get(commonObjects.nextRoundTimerText, { timeout: 120000 })
  .get(commonObjects.placeBetTimerText, { timeout: 120000 })
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
  .get(commonObjects.nextRoundTimerText, { timeout: 120000 })

  .get(commonObjects.nextRoundTimerText)
  .should('not.exist')
}

let betAndConfirm = () => {
  addAllTokens()
  tryToPlaceBet()
}

let placeOverMaximumLimitBet = () => {
  addAllTokens()
  addAllTokens()
  addAllTokens()
  addAllTokens()
  addAllTokens()
  addAllTokens()
  addAllTokens()
  tryToPlaceBet()
}

let generateRandomIntInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

let selectRandomDigit = () => {
  const num = generateRandomIntInRange(0,9)
    cy.get(numpadObjects.numpadRow)
    .eq(num)
    .click()
}

let inputAutobetRandomMultiplier = () => {
  selectRandomDigit()

  cy
  .get(numpadObjects.dotNumpad)
  .click()

  selectRandomDigit()
  selectRandomDigit()
}

let eraseAutobetMultiplier = () => {
  for(let i = 1; i <= 4; i++) {
    cy
    .get(numpadObjects.numpadBackspace)
    .click()
  }
}
//Proper Tests
describe('Testing Bets', () => {
  
  xit('should not let the user bet less than the minimum bet', () => {
    waitUntilUserCanBetOnNewRound()
    
    cy
    .get(betObjects.tokenOne)
    .click()
    tryToPlaceBet()

    cy
    .get(commonObjects.errorWrapper)
    .should('be.visible')
    .get(commonObjects.errorIcon)
    .should('be.visible')
    .get(commonObjects.errorTitle)
    .should('have.text', 'Betslip Error')
    .get(commonObjects.errorDescription)
    .should('have.text', 'Invalid stake')
    .get(commonObjects.errorCloseButton)
    .click()
    
    .get(commonObjects.errorWrapper)
    .should('not.exist')
    .get(commonObjects.errorIcon)
    .should('not.exist')
    .get(commonObjects.errorTitle)
    .should('not.exist')
    .get(commonObjects.errorDescription)
    .should('not.exist')

  })

  it('should verify all elements in a complete round without betting', () => {
    //***** BETTING PHASE ******//

    waitUntilUserCanBetOnNewRound()

    //should display timer for new bets when the game busts
    cy
    .get(commonObjects.placeBetTimerText)
    .should('be.visible')
    .contains('Place your bet in:')

    //should bust the game without placing bets and check elements
    cy
    .get(commonObjects.busted)
    .should('have.text', 'Bust')
    .get(commonObjects.placeBetTimer)
    .should('not.be.empty')

    //should have the confirm button disabled if stake is 0
    .get(betObjects.stake)
    .should('have.text', '€0,00')
    tryToPlaceBet()
    cy
    .get(commonObjects.confirmingBetScreen)
    .should('not.be.visible')

    //should add a token of every value to the stake multiple times
    addAllTokens()
    addAllTokens()
    addAllTokens()
    addAllTokens()
    cy
    .get(betObjects.stake)
    .should('have.text', '€344,00')

    //should clear a bet and verify that the confirm button is disabled
    .get(betObjects.clearStake)
    .click()
    .get(betObjects.stake)
    .should('have.text', '€0,00')
    .get(betObjects.confirmBetButton)
    tryToPlaceBet()
    cy
    .get(commonObjects.confirmingBetScreen)
    .should('not.be.visible')

    //

    //***** BETS CLOSED PHASE ******//
    cy.get(commonObjects.nextRoundTimerText, { timeout: 120000 })

    //should display timer when the game is about to start
    cy
    .should('be.visible')
    .contains('Next round starts in:')

    //should warn the player when betting is paused
    .get(betObjects.betPausedUpperText)
    .should('have.text', 'Betting Paused!')
    .get(betObjects.betPausedBottomText)
    .should('have.text', 'Wait for current game to end')
    .get(betObjects.confirmBetButton)
    .should('not.be.visible')

    //***** GAME PHASE ******//
    gameStarted()

    //should not display counters when the game is running
    cy
    .get(commonObjects.busted)
    .should('not.exist')
    .get(commonObjects.placeBetTimer)
    .should('not.exist')
  })

  it('should verify all elements in a complete round after betting', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()

    //should place a simple bet
    addAllTokens()
    addAllTokens()
    addAllTokens()
    addAllTokens()
    cy
    .get(betObjects.stake)
    .should('have.text', '€344,00')
    waitUntilUserCanBet()
    betAndConfirm()
    cy
    .get(betObjects.cashOutBtn)
    .should('have.attr', 'disabled')
    //***** BETS CLOSED PHASE ******//
    cy.get(commonObjects.nextRoundTimerText, { timeout: 120000 })

    //should display timer when the game is about to start
    cy
    .should('be.visible')
    .contains('Next round starts in:')

    //***** GAME PHASE ******//
    gameStarted()

    //should display the multiplier when the player bets and the game starts
    cy
    .get(betObjects.cashOutBtn)
    .should('be.visible')
    .get(commonObjects.multiplier)
    .should('be.visible')

    //should not display the bet tab when a bet was placed and the game is running
    cy
    .get(commonObjects.betTabContainer)
    .should('not.be.visible')
    .get(commonObjects.historyTabContainer)
    .should('not.be.visible')
    .get(commonObjects.playersTabContainer)
    .should('not.be.visible')

    //should display current stake and last game bets after betting
    cy
    .get(betObjects.betSummary)
    .should('be.visible')
    .get(betObjects.betSummaryStake)
    .contains('€430,00')
    .get(betObjects.betSummaryLastStake)
    .should('be.visible')
    //#TODO: Implement last bet when feature is out.

    //should cash out the bet and verify winning elements
    cy
    .get(betObjects.cashOutBtn)
    .click()
    
    .get(commonObjects.winToast)
    .should('be.visible')

    //***** BUST PHASE ******//
    cy.get(commonObjects.placeBetTimerText, { timeout: 120000 })
    
    //should return the stake to a previous state after a complete round
    .get(betObjects.stake)
    .should('have.text', '€430,00')
    .get(betObjects.clearStake)
    .click()
    .get(betObjects.stake)
    .should('have.text', '€0,00')
  })

  it('should verify all elements of history tab in a complete round without betting', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()
    cy.get(commonObjects.bustValue).then(($bustValue) => {

    const bustValueWithoutX = $bustValue.text()
    const bustValueWithX = bustValueWithoutX + ' X';
    
    cy.get(commonObjects.historyTab)
    .click()
    .get(commonObjects.historyOne)
    .should('have.text', bustValueWithX)
    .get(commonObjects.historyTabContainer)
    .should('be.visible')  
    })
  })

  it('should verify all elements of history tab in a complete round after betting', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()

    //should place a simple bet
    addAllTokens()
    waitUntilUserCanBet()
    betAndConfirm()
    cy
    .get(betObjects.cashOutBtn)
    .should('have.attr', 'disabled')

    //***** BETS CLOSED PHASE ******//
    

    //***** GAME PHASE ******//
    gameStarted()

    //***** BUST PHASE ******//
    cy.get(commonObjects.placeBetTimerText, { timeout: 120000 })
    
    .get(commonObjects.historyTab)
    .click()
    .get(commonObjects.historyFirstStake)
    .should('have.text',  '€172,00')

    cy.get(commonObjects.bustValue).then(($bustValue) => {

      const bustValueWithoutX = $bustValue.text()
      const bustValueWithX = bustValueWithoutX + ' X';
      cy
      .get(commonObjects.historyOne)
      .should('have.text', bustValueWithX)
    })
  })

  it('should not let the user bet more than the maximum bet', () => {
    waitUntilUserCanBetOnNewRound()
    placeOverMaximumLimitBet()

    cy
    .get(commonObjects.errorWrapper)
    .should('be.visible')
    .get(commonObjects.errorIcon)
    .should('be.visible')
    .get(commonObjects.errorTitle)
    .should('have.text', 'Betslip Error')
    .get(commonObjects.errorDescription)
    .should('have.text', 'Invalid stake')
    .get(commonObjects.errorCloseButton)
    .click()
    
    .get(commonObjects.errorWrapper)
    .should('not.exist')
    .get(commonObjects.errorIcon)
    .should('not.exist')
    .get(commonObjects.errorTitle)
    .should('not.exist')
    .get(commonObjects.errorDescription)
    .should('not.exist')
  })

  it.only('should modify an auto cashout value', () => {
    //***** BETTING PHASE ******//
    
    
    cy
    .get(betObjects.autoCashoutMultiplier)
    .click()
    
    //verify elements in numpad wrapper
    cy
    .get(numpadObjects.numpadWrapper)
    .should('be.visible')
    .get(numpadObjects.confirmButtonNumpad)
    .should('be.visible')
    .get(numpadObjects.closeButtonNumpad)
    .should('be.visible')

    
    //Select random number and verifies that it was correctly confirmed
    inputAutobetRandomMultiplier()

    cy
    .get(numpadObjects.multiplier).then(mult => {
      const chosenMultiplier = mult.text()
      cy
      .get(numpadObjects.confirmButtonNumpad)
      .click()

      .get(betObjects.autoCashoutMultiplier)
      .should('have.text', chosenMultiplier + ' X')

      
      /*
      .get(betObjects.autoCashoutToggleActive)
      .should('be.visible')
      */
    })
  
    //Select random number, change it to another and verify confirmation
    cy
    .get(betObjects.autoCashoutMultiplier)
    .click()

    eraseAutobetMultiplier()

    inputAutobetRandomMultiplier()

    cy
    .get(numpadObjects.multiplier).then(mult => {
      const chosenMultiplier = mult.text()
      cy
      .get(numpadObjects.confirmButtonNumpad)
      .click()

      .get(betObjects.autoCashoutMultiplier)
      .should('have.text', chosenMultiplier + ' X')
    })
  
    //Disable autobet
    cy
    .get(betObjects.autoCashoutToggleActive)
    .click()

    //should place a simple bet
    addAllTokens()
    waitUntilUserCanBet()
    betAndConfirm()
    cy
    .get(betObjects.cashOutBtn)
    .should('have.attr', 'disabled')

    //***** BETS CLOSED PHASE ******//
    

    //***** GAME PHASE ******//
    gameStarted()

    //***** BUST PHASE ******//
    cy.get(commonObjects.placeBetTimerText, { timeout: 120000 })
    
    .get(commonObjects.historyTab)
    .click()
    .get(commonObjects.historyFirstStake)
    .should('have.text',  '€172,00')

    cy.get(commonObjects.bustValue).then(($bustValue) => {

      const bustValueWithoutX = $bustValue.text()
      const bustValueWithX = bustValueWithoutX + ' X';
      cy
      .get(commonObjects.historyOne)
      .should('have.text', bustValueWithX)
    })
  })
})

